# 🚀 MindFlare: Explore the Cosmos of Knowledge ✨

Embark on an immersive journey with **MindFlare**—where education transcends earthly limits and soars through the cosmos.

```mermaid
flowchart TD
  subgraph MindFlare
    style MFText fill:#000033,stroke:#ffffff,stroke-width:3px;
    MFText ---o|🌌 Explore Topics| MFText[" "]
    MFText ===>|🚀 Navigate Learning Paths| MFText[" "]
    MFText -.->|🛰️ Interact with your educational experience| MFText(("LIMITLESS
    POSSIBILITIES
     "))
  end
```

In the cosmic expanse of MindFlare, users launch into an educational odyssey, exploring topics, navigating personalized learning paths, and engaging in an interactive educational experience. The knowledge space expands into a cosmic realm, revealing wonders to discover.

Journey through MindFlare, where learning becomes an interstellar adventure, and knowledge awaits exploration in the cosmic space of endless possibilities.🌌📚

```mermaid
---
title: Entity Relationship Diagram
---

erDiagram
    users {
        id serial PK
        username varchar(255)
        email varchar(80)
        password varchar(255)
        premium boolean
    }
    decks {
        id serial PK
        deckname varchar(255)
        user_id integer FK
    }
    flashcards {
        id serial PK
        question varchar(300)
        answer varchar(3000)
    }
    deck_flashcard {
        id serial PK
        deck_id integer FK
        flashcard_id integer FK
    }

    users ||--o{ decks : owns
    decks ||--o{ deck_flashcard : contains
    flashcards ||--o{ deck_flashcard : included_in
```

Documentation Used => https://mermaid.js.org/

Special Thanks => https://github.com/ajaymarathe/bootstrap-login-template
