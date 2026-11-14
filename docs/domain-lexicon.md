# 📚 Domain Lexicon & Copywriting Engine

> **Mandate**: Zero Dummy Text Policy (`AGENTS.md` Section 5.1).  
> Owned by `iron_man` (extraction) and enforced by `jarvis` (UI copy) and `friday` (frontend pages).

---

## 1. Domain Extraction Protocol

When `iron_man` reads client requirements in `README.md` during Project Discovery, it extracts and populates this document with domain-specific vocabulary. All agents MUST use these terms in UI components, form placeholders, table column headers, and empty states.

```markdown
### Active Project Lexicon

- **Industry / Domain**: [e.g., Healthcare / FinTech / E-commerce / SaaS / EdTech]
- **Target Audience**: [e.g., Clinical staff, retail investors, B2B procurement managers]
- **Brand Tone**: [e.g., Authoritative & Clean, Energetic & Playful, Institutional & Secure]
- **Currency & Formatting**: [e.g., USD ($), EUR (€), BDT (৳), 2-decimal formatting]
- **Primary Entity Names**:
  - Entity 1: [e.g., "Patient Record" (never "Item" or "Post")]
  - Entity 2: [e.g., "Prescription" (never "Thing" or "Card")]
  - Entity 3: [e.g., "Appointment" (never "Event")]
- **Standard Action Labels**:
  - Create Action: [e.g., "Book Appointment", "Create Invoice", "Add Patient"]
  - Submit Action: [e.g., "Confirm Payment", "Schedule Visit", "Save Record"]
```

---

## 2. Anti-Patterns (Strictly Forbidden in UI Code)

| ❌ Forbidden Pattern | Why It Fails | ✅ Required Domain Replacement |
|---|---|---|
| `"Lorem ipsum dolor sit amet"` | Destroys realism and client trust | Real contextual descriptions matching domain |
| `"Card Title" / "Item 1, 2, 3"` | Generic placeholder laziness | Actual entity names (e.g., "Dr. Sarah Jenkins", "Stripe Invoice #1042") |
| `"Button" / "Submit" / "Click here"` | Vague, poor accessibility | Action verbs (e.g., "Deploy Container", "Transfer Funds", "Download Report") |
| `"No data found"` | Boring, unhelpful empty state | Friendly empty state with Lucide icon + primary CTA |
| Broken image links (`/placeholder.jpg`) | Renders broken UI icons | SVG fallback avatar with user initials or Lucide icon |

---

## 3. Mandatory Copy Rules for Jarvis & Friday

1. **Empty States**: Every empty state must have:
   - An intuitive Lucide icon (e.g., `<FolderOpen />`, `<FileQuestion />`).
   - A friendly heading: *"No [Entity Names] yet"*.
   - A descriptive sentence: *"Get started by creating your first [Entity Name] below."*
   - A high-visibility primary CTA button: *"[Create Entity Name]"*.
2. **Form Placeholders**: Must provide helpful examples:
   - Email: `name@company.com`
   - Name: `Jane Doe`
   - Search: `Search by [entity name, order ID, patient ID]...`
3. **Toasts & Feedback**:
   - Success: `"[Entity Name] created successfully."`
   - Failure: `"Failed to save [Entity Name]. Please check your input."`

