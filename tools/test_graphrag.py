"""Test GraphRAG get_skill_instructions function."""
from neo4j_tool import get_skill_instructions, search_skill_instructions

print("🧠 Testing Full GraphRAG Functions")
print("=" * 50)

# Test get_skill_instructions
print("\n📖 Testing get_skill_instructions('dokploy'):")
r = get_skill_instructions('dokploy')
if r:
    print(f"   Name: {r['name']}")
    print(f"   Category: {r['category']}")
    print(f"   Status: {r['status']}")
    if r.get('instructions'):
        print(f"   Instructions (preview): {r['instructions'][:150]}...")
    else:
        print("   Instructions: None")
else:
    print("   Skill not found")

# Test search_skill_instructions
print("\n🔍 Testing search_skill_instructions('docker'):")
results = search_skill_instructions('docker', limit=3)
for skill in results:
    print(f"   • {skill['name']}: {skill.get('instructions', '')[:50]}...")

print("\n✅ GraphRAG functions working!")
