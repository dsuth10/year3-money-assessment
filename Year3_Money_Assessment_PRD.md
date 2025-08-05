
# Offline Year 3 “Money” e‑Assessment – Product Requirements Document  
*React Single‑Page App with IndexedDB (Option 2)*  

## 1 Document Control
| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 0.9 DRAFT | 2025‑08‑05 | ChatGPT (Project PM) | Initial comprehensive PRD for stakeholder review |

## 2 Executive Summary
Build a **single‑page React web app** that delivers a 21‑question Year 3 money assessment offline. Pupils launch the quiz by double‑clicking `index.html` on a shared network drive. All interactivity (drag‑and‑drop coins/notes, sorting, text entry, radio buttons) runs client‑side. Each student’s responses and score are persisted locally in **IndexedDB** and can be exported as a CSV for teachers. The whole bundle must work without internet, on Windows PCs, with concurrent classroom use.

## 3 Goals & Success Metrics
| Goal | KPI / Success Measure |
|------|-----------------------|
| Seamless offline usage | ≥ 95 % of pupils complete the quiz without teacher tech assistance |
| Accurate result capture | 100 % of completed attempts stored in IndexedDB and exportable |
| Ease of deployment | Teacher copies / replaces a single `dist/` folder; no installs |
| Fast load | First screen ≤ 3 s on a 2017‑era Windows laptop |
| Accessibility baseline | Colour contrast ≥ AA; keyboard usable; voice‑over labels |

## 4 Background & Context
* Current worksheet is a Flash‑era activity now replaced by interactive web app.  
* School network lacks a local web server; IT policy forbids installing software on student PCs.  
* Teachers need drag‑and‑drop visuals that mimic Australian coins/notes.  
* Automating marking will save > 30 min per class.

## 5 Stakeholders
| Role | Team / Name | Interest |
|------|-------------|----------|
| Product Owner | Douglas Sutherland | Curriculum alignment & usability |
| Teacher Users | Year 3 educators | Assess learning evidence |
| Pupils | Year 3 students | Engage with interactive tasks |
| IT Support | School ICT officer | Deployment & permissions |

## 6 Personas (Condensed)
1. **Ms Smith** – Year 3 teacher; moderate tech confidence. Needs one‑click quiz & CSV marks.  
2. **Lachlan** – 8‑year‑old; uses mouse; limited attention span; needs clear UI cues.

## 7 Assumptions
* Classroom PCs run **Edge ≥ 115** or **Chrome ≥ 115**.  
* Pupils log in under a generic classroom Windows account (shared browser profile).  
* Network‑share bandwidth is adequate.  
* Coin/note graphics are licensed or original artwork.

## 8 Scope
### In‑Scope
* 21 interactive questions (see §11).  
* Per‑question correctness logic.  
* Automatic scoring & summary screen.  
* IndexedDB persistence; CSV export.  
* “Start New Student” reset flow.

### Out‑of‑Scope
* Server‑side dashboards.  
* Multi‑language UI.  
* Real‑time data sync.

## 9 Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| FR‑1 | App loads fully offline after initial open | Must |
| FR‑2 | Exactly 21 questions in fixed order | Must |
| FR‑3 | Drag‑and‑drop of coin/note images | Must |
| FR‑4 | Validate each answer on “Submit” | Should |
| FR‑5 | Save each answer & mark to IndexedDB in real‑time | Must |
| FR‑6 | Calculate total score on completion | Must |
| FR‑7 | Export results as CSV | Must |
| FR‑8 | “Start New Student” clears volatile state | Should |
| FR‑9 | Fully keyboard accessible | Should |
| FR‑10 | Operates correctly on multiple PCs concurrently | Must |

## 10 Non‑Functional Requirements
| Category | Requirement |
|----------|-------------|
| Performance | Initial load < 3 s; bundle ≤ 4 MB gzipped |
| Reliability | IndexedDB write errors raise user‑visible alert; retry logic |
| Security | No remote network calls; strict CSP |
| Privacy | Only pseudonymous student IDs stored |
| Maintainability | TypeScript with ESLint, Prettier; 80 % unit‑test coverage |
| Portability | Runs in any modern Chromium browser on Windows |

## 11 Question Catalogue & Interaction Patterns
| # | Interaction | Example | Data Stored |
|---|-------------|---------|-------------|
| 1 | Drag coins to make **50 ¢** | Notebook 50 ¢ | Coin set, correct flag |
| 3 | Drag note to make **$5** | Doll $5 | Note chosen |
| 6 | Sort five notes high → low | Order notes | Final order array |
| 7 | True/False | `$2.50 > $0.85` | Boolean |
| 8 | MCQ equivalent value | Piggy banks A/B/C | Option |
| 12 | Text entry | `$10 + 2×$2` | Text |
| 21 | Change calculation | Wrap change from $50 | Amount |
*Full 1‑21 list maintained in design spec.*

## 12 Tech Stack & Architecture
| Layer | Technology | Notes |
|-------|------------|-------|
| UI | **React 18** + **TypeScript** | Functional components |
| State | **Zustand** or Context API | Small footprint |
| Drag & Drop | **@dnd-kit/core** | Accessible, touch‑friendly |
| Storage | **IndexedDB** via **Dexie 4** | Typed schema |
| Build | **Vite** | Fast dev & prod build |
| Styling | **Tailwind CSS** | Utility classes |
| Testing | **Jest** + **RTL** | Unit/integration |
| CSV Export | `file-saver` + Blob | One‑click download |

### Data Model
```ts
interface Attempt {
  uuid: string;
  studentId: string;
  answers: {
    qId: number;
    userInput: any;
    isCorrect: boolean;
  }[];
  score: number;
  startedAt: Date;
  completedAt: Date;
}
```

## 13 UX / UI Guidelines
* 1280×720 layout; large drag targets.  
* Progress pills 01‑21 footer.  
* Keyboard fallback for drag‑and‑drop.  
* WCAG‑AA colour contrast.  

## 14 Accessibility
| Guideline | Implementation |
|-----------|----------------|
| Alt text | `aria-label="50 cent coin"` etc. |
| Keyboard | Focus rings; arrow & space keys |
| Readability | Min 16 px; optional Lexend font |

## 15 Security & Privacy
* CSP: `default-src 'self'`  
* No external network calls.  
* IndexedDB is sandboxed per origin.  
* Exported CSV stored locally; treated as student work.  

## 16 Performance Targets
| Scenario | Budget |
|----------|--------|
| Initial load | ≤ 3 s |
| Drag latency | ≤ 16 ms per frame |
| IndexedDB write | ≤ 20 ms |

## 17 Deployment Flow
1. Dev: `npm run build` → `dist/`.  
2. Teacher copies `dist` to `\\NetworkShare\MoneyQuiz\`.  
3. Pupils double‑click `index.html`.  
4. To update: overwrite folder.  

## 18 Analytics & Reporting
* Per‑attempt CSV: `studentId, timestamp, q1, …, q21, score`.  
* Future: batch exporter.

## 19 Testing & QA
| Phase | Focus |
|-------|-------|
| Unit | Components, utils |
| Integration | Drag‑and‑drop, IndexedDB, CSV |
| E2E | Cypress full run |
| Accessibility | axe-core + manual |
| UAT | Pilot two classes |

## 20 Timeline (Indicative)
| Week | Milestone |
|------|-----------|
| 1 | Finalise PRD & question assets |
| 2‑3 | Repo scaffold, base nav |
| 4‑5 | Q1‑10 implementation |
| 6‑7 | Q11‑21, summary, CSV |
| 8 | Perf & a11y polish |
| 9 | QA / bug‑bash |
| 10 | Classroom pilot |
| 11 | Iterate, final build |
| 12 | Production rollout |


## 22 Open Questions
1. Final wording & art for Q10‑21.  
2. Student ID input method.  
3. Bulk CSV merge tool required 


---

*Last updated: 2025‑08‑05*
