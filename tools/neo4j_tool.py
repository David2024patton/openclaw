"""
Neo4j Query Tool for OpenClaw (Mike)
Complete toolkit for querying, managing, and snapshotting the knowledge graph.
"""

import json
import base64
import urllib.request
import urllib.error
import os
from datetime import datetime
from typing import Optional, Dict, Any, List
from pathlib import Path

# Configuration
NEO4J_HTTP = "http://REDACTED_VPS_IP:REDACTED_PORT"
NEO4J_USER = "neo4j"
NEO4J_PASS = "REDACTED_PASSWORD"
EXPORT_DIR = Path(r"D:\.OpenClaw\workspace\neo4j_exports")


# =============================================================================
# CORE QUERY FUNCTIONS
# =============================================================================

def neo4j_query(cypher: str, parameters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Execute a Cypher query against the Neo4j database.
    
    Args:
        cypher: The Cypher query string to execute
        parameters: Optional dictionary of query parameters
        
    Returns:
        Dictionary containing query results or error message
        
    Example:
        result = neo4j_query("MATCH (s:CommunitySkill) RETURN s.name LIMIT 10")
    """
    url = f"{NEO4J_HTTP}/db/neo4j/tx/commit"
    
    statement = {"statement": cypher}
    if parameters:
        statement["parameters"] = parameters
    
    body = json.dumps({"statements": [statement]}).encode('utf-8')
    credentials = base64.b64encode(f"{NEO4J_USER}:{NEO4J_PASS}".encode()).decode()
    
    request = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Basic {credentials}"
        },
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            result = json.loads(response.read().decode())
            
            if result.get("errors"):
                return {"error": result["errors"][0].get("message", "Unknown error")}
            
            if result.get("results") and result["results"][0].get("data"):
                columns = result["results"][0].get("columns", [])
                rows = []
                for row in result["results"][0]["data"]:
                    if "row" in row:
                        rows.append(dict(zip(columns, row["row"])))
                return {"success": True, "columns": columns, "rows": rows, "count": len(rows)}
            
            return {"success": True, "rows": [], "count": 0}
            
    except urllib.error.HTTPError as e:
        return {"error": f"HTTP {e.code}: {e.reason}"}
    except urllib.error.URLError as e:
        return {"error": f"Connection failed: {e.reason}"}
    except Exception as e:
        return {"error": str(e)}


# =============================================================================
# SEARCH COMMANDS
# =============================================================================

def find_skills(keyword: str = None, category: str = None, status: str = None, limit: int = 25) -> List[Dict]:
    """
    Find community skills by keyword, category, or security status.
    
    Examples:
        find_skills("browser")              # Search by keyword
        find_skills(category="AI & LLMs")   # Filter by category
        find_skills(status="SAFE")          # Filter by security status
        find_skills("docker", status="SAFE") # Combined search
    """
    conditions = []
    params = {}
    
    if status:
        conditions.append("s.securityStatus = $status")
        params["status"] = status
    
    if keyword:
        conditions.append("(toLower(s.name) CONTAINS toLower($keyword) OR toLower(s.description) CONTAINS toLower($keyword))")
        params["keyword"] = keyword
    
    if category:
        conditions.append("s.category = $category")
        params["category"] = category
    
    where_clause = " AND ".join(conditions) if conditions else "TRUE"
    params["limit"] = limit
    
    query = f"""
        MATCH (s:CommunitySkill)
        WHERE {where_clause}
        RETURN s.name as name, s.category as category, s.description as description, 
               s.securityStatus as status, s.author as author
        ORDER BY s.name
        LIMIT $limit
    """
    
    result = neo4j_query(query, params)
    return result.get("rows", [])


def get_skill_details(skill_name: str) -> Optional[Dict]:
    """Get detailed information about a specific skill."""
    result = neo4j_query(
        """MATCH (s:CommunitySkill {name: $name})
           OPTIONAL MATCH (s)-[:BELONGS_TO_CATEGORY]->(c)
           RETURN s.name as name, s.description as description, s.category as category,
                  s.url as url, s.author as author, s.securityStatus as status,
                  s.localPath as localPath, c.name as categoryName""",
        {"name": skill_name}
    )
    if result.get("rows"):
        return result["rows"][0]
    return None


def get_skill_instructions(skill_name: str) -> Optional[Dict]:
    """
    Get FULL skill instructions from Neo4j (GraphRAG).
    
    This is the key function for Full GraphRAG - retrieves complete SKILL.md content
    including instructions, examples, and commands without needing local files.
    
    Example:
        instructions = get_skill_instructions("dokploy")
        print(instructions["instructions"])  # Full how-to guide
        print(instructions["examples"])       # Code examples
        print(instructions["commands"])       # Available commands
    """
    result = neo4j_query(
        """MATCH (s:CommunitySkill {name: $name})
           RETURN s.name as name, 
                  s.description as description,
                  s.category as category,
                  s.instructions as instructions,
                  s.examples as examples,
                  s.commands as commands,
                  s.rawContent as rawContent,
                  s.securityStatus as status,
                  s.author as author,
                  s.url as url""",
        {"name": skill_name}
    )
    if result.get("rows"):
        row = result["rows"][0]
        # Parse JSON arrays if stored as strings
        if row.get("examples") and isinstance(row["examples"], str):
            try:
                row["examples"] = json.loads(row["examples"])
            except:
                pass
        if row.get("commands") and isinstance(row["commands"], str):
            try:
                row["commands"] = json.loads(row["commands"])
            except:
                pass
        return row
    return None


def search_skill_instructions(keyword: str, limit: int = 5) -> List[Dict]:
    """
    Search skills and return full instructions for matching skills.
    GraphRAG function that returns actionable content, not just metadata.
    """
    result = neo4j_query(
        """MATCH (s:CommunitySkill)
           WHERE s.instructions IS NOT NULL 
             AND (toLower(s.name) CONTAINS toLower($keyword) 
               OR toLower(s.description) CONTAINS toLower($keyword))
           RETURN s.name as name,
                  s.description as description,
                  s.category as category,
                  s.instructions as instructions,
                  s.examples as examples,
                  s.securityStatus as status
           ORDER BY s.name
           LIMIT $limit""",
        {"keyword": keyword, "limit": limit}
    )
    return result.get("rows", [])


# =============================================================================
# STATS & INFO COMMANDS
# =============================================================================

def get_graph_stats() -> Dict:
    """Get current graph statistics - count of all node types."""
    result = neo4j_query("""
        MATCH (n)
        WITH labels(n)[0] as label, count(n) as cnt
        RETURN label as Label, cnt as Count
        ORDER BY cnt DESC
    """)
    return result


def get_schema() -> Dict:
    """Get graph schema showing node types and relationships."""
    # Get node labels
    labels_result = neo4j_query("CALL db.labels() YIELD label RETURN label")
    
    # Get relationship types
    rels_result = neo4j_query("CALL db.relationshipTypes() YIELD relationshipType RETURN relationshipType")
    
    return {
        "labels": [r["label"] for r in labels_result.get("rows", [])],
        "relationships": [r["relationshipType"] for r in rels_result.get("rows", [])]
    }


def get_categories() -> List[str]:
    """List all skill categories."""
    result = neo4j_query("""
        MATCH (c:CommunitySkillCategory)
        RETURN c.name as name
        ORDER BY c.name
    """)
    return [r["name"] for r in result.get("rows", [])]


def count_by_status() -> Dict:
    """Get security status breakdown for community skills."""
    result = neo4j_query("""
        MATCH (s:CommunitySkill)
        RETURN s.securityStatus as Status, count(*) as Count
        ORDER BY Count DESC
    """)
    return {r["Status"]: r["Count"] for r in result.get("rows", [])}


def get_relationship_stats() -> Dict:
    """Get count of all relationship types."""
    result = neo4j_query("""
        MATCH ()-[r]->()
        RETURN type(r) as Relationship, count(r) as Count
        ORDER BY Count DESC
    """)
    return result


# =============================================================================
# SNAPSHOT & EXPORT COMMANDS
# =============================================================================

def snapshot_graph(filename: str = None) -> str:
    """
    Save full graph state to JSON file.
    Returns the path to the saved file.
    """
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    
    if not filename:
        filename = f"graph_snapshot_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    filepath = EXPORT_DIR / filename
    
    # Get all nodes
    nodes_result = neo4j_query("""
        MATCH (n)
        RETURN id(n) as id, labels(n) as labels, properties(n) as props
        LIMIT 5000
    """)
    
    # Get all relationships
    rels_result = neo4j_query("""
        MATCH (a)-[r]->(b)
        RETURN id(a) as from_id, id(b) as to_id, type(r) as type, properties(r) as props
        LIMIT 10000
    """)
    
    snapshot = {
        "timestamp": datetime.now().isoformat(),
        "node_count": len(nodes_result.get("rows", [])),
        "relationship_count": len(rels_result.get("rows", [])),
        "nodes": nodes_result.get("rows", []),
        "relationships": rels_result.get("rows", [])
    }
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(snapshot, f, indent=2, default=str)
    
    return str(filepath)


def export_skills_csv(filename: str = None) -> str:
    """Export all community skills to CSV file."""
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    
    if not filename:
        filename = f"skills_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    filepath = EXPORT_DIR / filename
    
    result = neo4j_query("""
        MATCH (s:CommunitySkill)
        RETURN s.name as name, s.category as category, s.author as author,
               s.description as description, s.securityStatus as status, s.url as url
        ORDER BY s.category, s.name
    """)
    
    rows = result.get("rows", [])
    if rows:
        import csv
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
    
    return str(filepath)


def backup_graph() -> str:
    """Create a timestamped full backup of the graph."""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    return snapshot_graph(f"backup_{timestamp}.json")


# =============================================================================
# CREATE/DELETE COMMANDS
# =============================================================================

def create_node(label: str, properties: Dict) -> Dict:
    """
    Create a new node in the graph.
    
    Example:
        create_node("Skill", {"name": "my-skill", "description": "Does cool stuff"})
    """
    props_str = ", ".join([f"{k}: ${k}" for k in properties.keys()])
    query = f"CREATE (n:{label} {{{props_str}}}) RETURN n"
    return neo4j_query(query, properties)


def create_relationship(from_label: str, from_name: str, to_label: str, to_name: str, rel_type: str) -> Dict:
    """
    Create a relationship between two nodes.
    
    Example:
        create_relationship("Skill", "neo4j", "SkillCategory", "Database & Data", "BELONGS_TO")
    """
    query = f"""
        MATCH (a:{from_label} {{name: $from_name}})
        MATCH (b:{to_label} {{name: $to_name}})
        MERGE (a)-[r:{rel_type}]->(b)
        RETURN a.name, type(r), b.name
    """
    return neo4j_query(query, {"from_name": from_name, "to_name": to_name})


def delete_node(label: str, name: str) -> Dict:
    """Delete a node by label and name (also removes relationships)."""
    query = f"MATCH (n:{label} {{name: $name}}) DETACH DELETE n RETURN count(n) as deleted"
    return neo4j_query(query, {"name": name})


# =============================================================================
# TOOL HANDLER FOR OPENCLAW
# =============================================================================

TOOL_DEFINITION = {
    "name": "neo4j",
    "description": """Query and manage the Neo4j knowledge graph. Available actions:
    - query: Run raw Cypher query
    - find_skills: Search community skills by keyword/category/status
    - skill_details: Get full details of a skill
    - stats: Get graph statistics
    - schema: Get graph schema
    - categories: List all categories
    - status_breakdown: Security status counts
    - snapshot: Save graph to JSON file
    - export_csv: Export skills to CSV
    - backup: Create timestamped backup
    - create_node: Create a new node
    - delete_node: Delete a node""",
    "parameters": {
        "type": "object",
        "properties": {
            "action": {
                "type": "string",
                "enum": ["query", "find_skills", "skill_details", "stats", "schema", 
                         "categories", "status_breakdown", "snapshot", "export_csv", 
                         "backup", "create_node", "delete_node"],
                "description": "The action to perform"
            },
            "cypher": {"type": "string", "description": "Cypher query (for 'query' action)"},
            "keyword": {"type": "string", "description": "Search keyword"},
            "category": {"type": "string", "description": "Category filter"},
            "status": {"type": "string", "description": "Security status filter"},
            "skill_name": {"type": "string", "description": "Skill name"},
            "label": {"type": "string", "description": "Node label"},
            "properties": {"type": "object", "description": "Node properties"},
            "filename": {"type": "string", "description": "Export filename"}
        },
        "required": ["action"]
    }
}


def handle_tool_call(action: str, **kwargs) -> str:
    """Handle tool calls from the agent."""
    
    if action == "query":
        result = neo4j_query(kwargs.get("cypher", "MATCH (n) RETURN labels(n), count(n) LIMIT 10"))
    elif action == "find_skills":
        result = {"skills": find_skills(
            keyword=kwargs.get("keyword"),
            category=kwargs.get("category"),
            status=kwargs.get("status")
        )}
    elif action == "skill_details":
        result = get_skill_details(kwargs.get("skill_name", ""))
    elif action == "stats":
        result = get_graph_stats()
    elif action == "schema":
        result = get_schema()
    elif action == "categories":
        result = {"categories": get_categories()}
    elif action == "status_breakdown":
        result = count_by_status()
    elif action == "snapshot":
        path = snapshot_graph(kwargs.get("filename"))
        result = {"success": True, "path": path}
    elif action == "export_csv":
        path = export_skills_csv(kwargs.get("filename"))
        result = {"success": True, "path": path}
    elif action == "backup":
        path = backup_graph()
        result = {"success": True, "path": path}
    elif action == "create_node":
        result = create_node(kwargs.get("label", "Node"), kwargs.get("properties", {}))
    elif action == "delete_node":
        result = delete_node(kwargs.get("label", "Node"), kwargs.get("skill_name", ""))
    else:
        result = {"error": f"Unknown action: {action}"}
    
    return json.dumps(result, indent=2, default=str)


# =============================================================================
# CLI TEST
# =============================================================================

if __name__ == "__main__":
    print("🔗 Neo4j Tool for Mike - OpenClaw")
    print("=" * 50)
    
    print("\n📊 Graph Statistics:")
    stats = get_graph_stats()
    for row in stats.get("rows", [])[:5]:
        print(f"   {row['Label']}: {row['Count']}")
    
    print("\n🔒 Security Status Breakdown:")
    status = count_by_status()
    for s, c in status.items():
        print(f"   {s}: {c}")
    
    print("\n📁 Categories:")
    for cat in get_categories():
        print(f"   • {cat}")
    
    print("\n🔍 Sample Safe Browser Skills:")
    skills = find_skills(keyword="browser", status="SAFE")
    for skill in skills[:3]:
        print(f"   • {skill['name']} ({skill['category']})")
    
    print("\n📸 Taking snapshot...")
    path = snapshot_graph()
    print(f"   Saved to: {path}")
    
    print("\n✅ All commands working!")
