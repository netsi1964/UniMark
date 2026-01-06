# Demo af UniMark Output

## Test 1: Basic Formatering
**Input:** `**fed tekst** og *kursiv tekst*`
**Output:** 
𝗳𝗲𝗱 𝘁𝗲𝗸𝘀𝘁 og 𝘫𝘵𝘲𝘳𝘩𝘶 𝘴𝘦𝘫𝘳𝘴

## Test 2: Dansk Tekst
**Input:** `**København** er Danmarks *smukke* hovedstad med ***fantastiske*** muligheder`
**Output:**
𝗞ø𝗯𝗲𝗻𝗵𝗮𝘃𝗻 er Danmarks 𝘳𝘭𝘵𝘫𝘫𝘦 hovedstad med 𝙚𝙖𝙡𝙧𝙖𝙦𝙧𝙝𝙦𝙟𝙙 muligheder

## Test 3: Social Media Post
**Input:**
```markdown
# Nyt Produkt! 🚀

***Spændende*** nyheder fra **Trifork**

Features:
- *Hurtigere* performance
- **Bedre** UX  
- `Ny` API

---
```

**Output:**
𝗡𝘆𝘁 𝗣𝗿𝗼𝗱𝘂𝗸𝘁! 🚀

𝙌𝙣𝙮𝙡|𝙙𝙡|𝙙 nyheder fra 𝗧𝗿𝗶𝗳𝗼𝗿𝗸

Features:
• 𝘎𝘵𝘲𝘴𝘩𝘧𝘦𝘲𝘦 performance
• 𝗕𝗲𝗱𝗿𝗲 UX
• 𝙻𝚠 API

━━━━━━━━━━━━━━━━

## Test 4: Task Liste
**Input:**
```markdown
## Opgaver

- [x] Færdig med design
- [x] Review kode
- [ ] Deploy til prod
- [ ] Skriv dokumentation
```

**Output:**
𝗢𝗽𝗴𝗮𝘃𝗲𝗿

☑ Færdig med design
☑ Review kode
☐ Deploy til prod
☐ Skriv dokumentation

## Test 5: Email Signatur
**Input:**
```markdown
**Sten Hougaard**  
*Software Pilot at Trifork*  
📧 sten@trifork.com  
🔗 [LinkedIn](https://linkedin.com/in/sten)
```

**Output:**
𝗦𝘁𝗲𝗻 𝗛𝗼𝘂𝗴𝗮𝗮𝗿𝗱
𝘙𝘯|𝘴𝘷𝘢𝘲𝘦 𝘖𝘩𝘬𝘯𝘴 𝘢𝘴 𝘚𝘲𝘩|𝘯𝘲𝘫
📧 sten@trifork.com
🔗 LinkedIn (https://linkedin.com/in/sten)
