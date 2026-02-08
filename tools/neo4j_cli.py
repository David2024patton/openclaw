"""
CLI wrapper for neo4j_tool.py to support command-line arguments.
Usage:
    python neo4j_cli.py              - Show stats
    python neo4j_cli.py find docker  - Find skills
    python neo4j_cli.py get dokploy  - Get instructions
"""
import sys
import json
from neo4j_tool import get_graph_stats, find_skills, get_skill_instructions, count_by_status, get_categories

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "find" and len(sys.argv) > 2:
            keyword = sys.argv[2]
            print(f"🔍 Searching for skills matching '{keyword}'...")
            skills = find_skills(keyword=keyword)
            if skills:
                print(f"\nFound {len(skills)} skills:\n")
                for skill in skills[:10]:
                    print(f"  • {skill['name']} ({skill['category']})")
                    print(f"    {skill['description'][:80]}...")
                    print()
            else:
                print("No skills found.")
        
        elif command == "get" and len(sys.argv) > 2:
            skill_name = sys.argv[2]
            print(f"📖 Getting instructions for '{skill_name}'...")
            skill = get_skill_instructions(skill_name)
            if skill:
                print(f"\n{skill['name']} - {skill['category']}")
                print(f"{skill['description']}\n")
                if skill.get('instructions'):
                    print("Instructions:")
                    inst = skill.get('instructions', '')
                    print(inst[:500] + "..." if len(inst) > 500 else inst)
                if skill.get('commands'):
                    print("\nCommands:")
                    cmds = skill['commands'] if isinstance(skill['commands'], list) else []
                    for cmd in cmds[:5]:
                        print(f"  - {cmd}")
            else:
                print(f"Skill '{skill_name}' not found.")
        
        else:
            print("Usage:")
            print("  python neo4j_cli.py              - Show graph stats")
            print("  python neo4j_cli.py find docker  - Find 'docker' skills")
            print("  python neo4j_cli.py get dokploy  - Get 'dokploy' instructions")
            sys.exit(1)
    
    else:
        # Default: show stats
        print("🔗 Neo4j GraphRAG - 463 Community Skills")
        print("=" * 50)
        
        print("\n📊 Graph Statistics:")
        stats = get_graph_stats()
        for row in stats.get("rows", [])[:5]:
            print(f"   {row['Label']}: {row['Count']}")
        
        print("\n🔒 Security Status:")
        status = count_by_status()
        for s, c in status.items():
            print(f"   {s}: {c}")
        
        print("\n✅ GraphRAG Ready!")
