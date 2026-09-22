# Proposal

- **Core features.**
  - User Sign In (Low Priority)
  - Title and Description of the Commission piece
  - Name, Prices, and Types of the Commission piece
  - References (Gallery) of the Piece
  - Notes to add on the Commission (Example: Changes to apply)
  - Starting date and deadline (If deadline was mentioned). (Add duration to know how long the art has been in commission)
  - Completion Status
  - Payment Status

- **Where each piece is hosted.**
  - Client: *Vercel*- Hosts the React/Vite frontend of ArtFlow. Free usage has limits on bandwidth and build resources.
  - API: *Render*- Hosts the Express REST API that handles application requests and commission data. Free services may sleep when inactive, causing a delay on the first request.
  - Database: *Neon*- Hosts the PostgreSQL database containing users, commissions, references, notes, and other application data. The free tier has limits on storage and usage.

- **The date demo mode goes off.**
  - 1st week of November
- **Risks.** 
   - Current Risks:
     - The Login page might be harder than expected. It's now optional, and must only be tried last.   
     - The Reference Gallery may easily run out of storage based on how large the file is
     - The App needs to calculate the duration correctly
