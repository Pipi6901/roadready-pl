# Adapty onboarding — HTML blocks (EN branch)

Every text element of the onboarding as a self-contained HTML block for Adapty's
"HTML" element: Montserrat, inline styles only, no JS, `white-space: normal` so
the text always wraps. Buttons and quiz options stay native Adapty elements —
their labels are listed under each screen as plain text to paste.

Why blocks and not native text: text copied out of Pencil carries non-breaking
spaces (U+00A0), which gives the browser no place to wrap a line, and the line
runs off the right edge. Copy the code from here — the spaces are ordinary.

Palette (dark): text `#ECF2EE`, secondary `#A3B0A9`, muted `#7F8B85`, accent
`#5BB4EE`, red `#F87171`, amber `#F5B54A`, green `#34D399`, card `#1A231F`,
border `#33413B`, icon box `#212C27` / `#22323F`.

Flow: S1 → (translation) L2 → S3 → L4 → L5 → L6 → S7 → S8 → S9 → S10 → S11 → S12 → paywall
      S1 → (Polish only) E2 → S3 → E4 → E5 → E6 → S7 → … same tail.

---

## S1 · Hook + language

**Block 1 — title, subtitle, question**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">On exam day you get <span style="color:#5BB4EE;">15 seconds to answer</span></h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">32 questions in 25 minutes. No going back, no second look. Every word has to land the first time — in Polish.</p>
  <p style="margin:28px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:17px;font-weight:700;line-height:1.3;color:#ECF2EE;text-align:center;overflow-wrap:break-word;">So — what language do you think in?</p>
</div>
```

**Native quiz tiles (2 columns):** `English` · `Українська` · `Русский` · `Español` · `Türkçe` · `Polski`

**Block 2 — note under the tiles**

```html
<p style="margin:0;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;font-size:13px;font-weight:400;line-height:1.45;color:#7F8B85;white-space:normal;overflow-wrap:break-word;">The exam itself is sat in Polish, English, German or Ukrainian. You can change this anytime in Settings.</p>
```

---

## L2 · The enemy (translation branch)

**Block 1 — 50%, statement, subtitle**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:76px;font-weight:700;line-height:1;letter-spacing:-1px;color:#F87171;">50%</p>
  <h1 style="margin:10px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:22px;font-weight:700;line-height:1.25;color:#ECF2EE;overflow-wrap:break-word;">of candidates fail the Polish theory test.</h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Most of them know the rules. They lose the points on words — <em style="font-style:italic;color:#ECF2EE;">ustąpić, dopuszczalna, wyłącznie</em> — against a 15-second clock.</p>
</div>
```

**Block 2 — card**

```html
<div style="display:flex;flex-direction:column;gap:10px;width:100%;box-sizing:border-box;padding:18px;background:#1A231F;border:1px solid #33413B;border-radius:18px;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <div style="display:flex;align-items:flex-start;gap:10px;">
    <svg viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:0 0 auto;width:22px;height:22px;margin-top:1px;"><circle cx="12" cy="12" r="10"></circle><path d="m4.9 4.9 14.2 14.2"></path></svg>
    <p style="margin:0;flex:1 1 auto;min-width:0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:700;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">And the clock doesn't wait for a dictionary</p>
  </div>
  <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:14.5px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">20 seconds to read, 15 to answer, and the next question comes whether you're ready or not. You can drop 6 points out of 74. Two wrong answers on the 3-point questions and you're on the edge.</p>
</div>
```

**Native button:** `So what do I do?`

---

## S3 · Have you sat the exam before?

**Block 1 — title, subtitle**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">Have you sat the exam before?</h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">It changes what we put in front of you first.</p>
</div>
```

**Native quiz options:** `Not yet — this is my first` · `Yes, I failed once` · `Yes, more than once`

**Block 2 — note**

```html
<p style="margin:0;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;font-size:13px;font-weight:400;line-height:1.45;color:#7F8B85;white-space:normal;overflow-wrap:break-word;">No judgement. About half of everyone in that WORD room fails.</p>
```

---

## L4 · Mirror (translation branch)

**Block 1 — eyebrow, title, subtitle**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <p style="margin:0 0 10px;font-family:Montserrat, system-ui, sans-serif;font-size:12px;font-weight:700;line-height:1.2;letter-spacing:1px;color:#5BB4EE;">BASED ON YOUR ANSWER</p>
  <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">Half the country fails this. <span style="color:#5BB4EE;">Not on driving — on wording</span></h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">You read the question. You knew the rule. And the answer still came out wrong — because the sentence was built to catch you, not to teach you.</p>
</div>
```

**Block 2 — quote card**

```html
<div style="display:flex;flex-direction:column;gap:14px;width:100%;box-sizing:border-box;padding:20px;background:#1A231F;border:1px solid #33413B;border-radius:18px;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:17px;font-weight:600;font-style:italic;line-height:1.4;color:#ECF2EE;overflow-wrap:break-word;" lang="pl">„Czy masz obowiązek ustąpić pierwszeństwa pieszemu, który dopiero zbliża się do przejścia?”</p>
  <div style="display:flex;align-items:center;gap:8px;">
    <svg viewBox="0 0 24 24" fill="none" stroke="#F5B54A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:0 0 auto;width:16px;height:16px;"><polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path></svg>
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15px;line-height:1.3;color:#A3B0A9;overflow-wrap:break-word;"><strong style="font-weight:700;color:#F5B54A;">dopiero</strong>&nbsp;&nbsp;decides the whole answer</p>
  </div>
</div>
```

**Native buttons:** `That's exactly it` (primary) · `Not really — show me anyway` (secondary)

---

## L5 · Demo question + translation

**Block 1 — title**

```html
<h1 style="margin:0;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;white-space:normal;overflow-wrap:break-word;">This is a question inside RoadReady</h1>
```

**Block 2 — question card + TAK/NIE (English variant; UK/RU/ES/TR variants were sent earlier, same structure)**

```html
<div style="display:flex;flex-direction:column;gap:12px;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <div style="background:#1A231F;border:1px solid #33413B;border-radius:20px;overflow:hidden;">
    <div style="display:flex;align-items:flex-start;gap:12px;padding:18px 18px 16px;">
      <div style="display:flex;flex-direction:column;gap:7px;flex:1 1 auto;min-width:0;">
        <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;color:#7F8B85;">POLSKI</p>
        <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:17px;font-weight:700;line-height:1.35;color:#ECF2EE;overflow-wrap:break-word;" lang="pl">Czy w tej sytuacji masz obowiązek zatrzymać się przed przejściem dla pieszych?</p>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:40px;height:40px;background:#22323F;border-radius:999px;box-sizing:border-box;" role="img" aria-label="Listen to the question"><svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:19px;height:19px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:7px;padding:14px 18px 18px;border-top:1px solid #33413B;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;color:#5BB4EE;">ENGLISH</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">In this situation, are you required to stop before the pedestrian crossing?</p>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:2px;padding:14px 18px;background:#1A231F;border:1px solid #33413B;border-radius:16px;">
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:700;color:#ECF2EE;">TAK</p>
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13px;color:#7F8B85;">Yes</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:2px;padding:14px 18px;background:#1A231F;border:1px solid #33413B;border-radius:16px;">
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:700;color:#ECF2EE;">NIE</p>
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13px;color:#7F8B85;">No</p>
  </div>
</div>
```

**Block 3 — note**

```html
<p style="margin:0;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;font-size:14px;font-weight:400;line-height:1.45;color:#7F8B85;white-space:normal;overflow-wrap:break-word;">Polish on top. Your language underneath. Every question, every explanation — with the same 15-second clock you'll face at WORD.</p>
```

**Native button:** `Now I get it`

---

## L6 · Mechanism (translation branch)

**Block 1 — title, subtitle**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">Here's how we fix it.</h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Three things, all aimed at the same problem.</p>
</div>
```

**Block 2 — three feature rows**

```html
<div style="display:flex;flex-direction:column;gap:22px;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <div style="display:flex;align-items:flex-start;gap:14px;">
    <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:40px;height:40px;background:#212C27;border-radius:12px;box-sizing:border-box;"><svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:20px;height:20px;"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg></div>
    <div style="display:flex;flex-direction:column;gap:4px;flex:1 1 auto;min-width:0;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15.5px;font-weight:600;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">Polish on top, your language underneath</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13.5px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Every question and every explanation, translated. You learn the rule, and the Polish it comes wrapped in.</p>
    </div>
  </div>
  <div style="display:flex;align-items:flex-start;gap:14px;">
    <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:40px;height:40px;background:#212C27;border-radius:12px;box-sizing:border-box;"><svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:20px;height:20px;"><line x1="10" x2="14" y1="2" y2="2"></line><line x1="12" x2="15" y1="14" y2="11"></line><circle cx="12" cy="14" r="8"></circle></svg></div>
    <div style="display:flex;flex-direction:column;gap:4px;flex:1 1 auto;min-width:0;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15.5px;font-weight:600;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">The real WORD clock</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13.5px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">20 seconds to read, 15 to answer, 32 questions, 74 points. Mock exams that feel exactly like the day itself — so the day itself feels like practice.</p>
    </div>
  </div>
  <div style="display:flex;align-items:flex-start;gap:14px;">
    <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:40px;height:40px;background:#212C27;border-radius:12px;box-sizing:border-box;"><svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:20px;height:20px;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg></div>
    <div style="display:flex;flex-direction:column;gap:4px;flex:1 1 auto;min-width:0;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15.5px;font-weight:600;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">Your mistakes come back</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13.5px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Every wrong answer lands in your weak spots and returns until you get it right twice in a row. Nothing slips through.</p>
    </div>
  </div>
</div>
```

**Native button:** `Set up my plan`

---

## E2 · The enemy (Polish-only branch)

**Block 1 — 50%, statement, subtitle**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:76px;font-weight:700;line-height:1;letter-spacing:-1px;color:#F87171;">50%</p>
  <h1 style="margin:10px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:22px;font-weight:700;line-height:1.25;color:#ECF2EE;overflow-wrap:break-word;">of candidates fail the Polish theory test.</h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Nearly all of them had read the textbook. Reading it and passing it in 25 minutes are two different skills.</p>
</div>
```

**Block 2 — card**

```html
<div style="display:flex;flex-direction:column;gap:10px;width:100%;box-sizing:border-box;padding:18px;background:#1A231F;border:1px solid #33413B;border-radius:18px;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <div style="display:flex;align-items:flex-start;gap:10px;">
    <svg viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:0 0 auto;width:22px;height:22px;margin-top:1px;"><line x1="10" x2="14" y1="2" y2="2"></line><line x1="12" x2="15" y1="14" y2="11"></line><circle cx="12" cy="14" r="8"></circle></svg>
    <p style="margin:0;flex:1 1 auto;min-width:0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:700;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">It's a speed test, not a reading test</p>
  </div>
  <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:14.5px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">32 questions, 25 minutes, 15 seconds to answer each one. Three answers that all look right — and no second look once you've moved on.</p>
</div>
```

**Native button:** `So what do I do?`

---

## E4 · Mirror (Polish-only branch)

**Block 1 — eyebrow, title, subtitle**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <p style="margin:0 0 10px;font-family:Montserrat, system-ui, sans-serif;font-size:12px;font-weight:700;line-height:1.2;letter-spacing:1px;color:#5BB4EE;">BASED ON YOUR ANSWER</p>
  <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">You're not short on knowledge. <span style="color:#5BB4EE;">You're short on reps.</span></h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">You can't revise your way past a question you've never had 15 seconds to answer. The gap isn't what you've read — it's what you've never been timed on.</p>
</div>
```

**Block 2 — quote card**

```html
<div style="display:flex;flex-direction:column;gap:14px;width:100%;box-sizing:border-box;padding:20px;background:#1A231F;border:1px solid #33413B;border-radius:18px;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:17px;font-weight:600;font-style:italic;line-height:1.4;color:#ECF2EE;overflow-wrap:break-word;" lang="pl">„Jaka jest dopuszczalna prędkość w obszarze zabudowanym w nocy?”</p>
  <div style="display:flex;align-items:center;gap:8px;">
    <svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:0 0 auto;width:16px;height:16px;"><polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path></svg>
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15px;line-height:1.3;color:#A3B0A9;overflow-wrap:break-word;"><strong style="font-weight:700;color:#5BB4EE;">50 km/h</strong>&nbsp;&nbsp;— and half the room still says 60.</p>
  </div>
</div>
```

**Native buttons:** `That's fair` (primary) · `Not really — show me anyway` (secondary)

---

## E5 · Demo question + feedback (Polish-only branch)

**Block 1 — title**

```html
<h1 style="margin:0;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;white-space:normal;overflow-wrap:break-word;">And this is what happens when you get one wrong.</h1>
```

**Block 2 — question card**

```html
<div style="display:flex;align-items:flex-start;gap:10px;width:100%;box-sizing:border-box;padding:14px 16px;background:#1A231F;border:1px solid #33413B;border-radius:18px;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <p style="margin:0;flex:1 1 auto;min-width:0;font-family:Montserrat, system-ui, sans-serif;font-size:15px;font-weight:700;line-height:1.35;color:#ECF2EE;overflow-wrap:break-word;" lang="pl">Czy w obszarze zabudowanym w nocy dopuszczalna prędkość wynosi 60 km/h?</p>
  <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:32px;height:32px;background:#22323F;border-radius:999px;box-sizing:border-box;" role="img" aria-label="Listen to the question"><svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:16px;height:16px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg></div>
</div>
```

**Block 3 — feedback sheet**

```html
<div style="display:flex;flex-direction:column;gap:8px;width:100%;box-sizing:border-box;padding:14px 16px;background:#1A231F;border:1px solid #33413B;border-radius:18px;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <div style="display:flex;align-items:center;gap:8px;">
    <svg viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:0 0 auto;width:18px;height:18px;"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:17px;font-weight:700;color:#F87171;">Not quite</p>
  </div>
  <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:12px;font-weight:600;color:#7F8B85;">Correct answer</p>
  <p style="margin:-4px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:15px;font-weight:700;color:#34D399;">NIE</p>
  <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13.5px;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Since 1 June 2021 it's 50 km/h in built-up areas around the clock. The night-time 60 is gone — and it's still one of the most-missed questions at WORD.</p>
  <div style="display:flex;align-items:center;gap:6px;padding:8px 10px;background:#212C27;border-radius:10px;">
    <svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:0 0 auto;width:13px;height:13px;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:12.5px;font-weight:600;color:#A3B0A9;">You'll see this one again</p>
  </div>
</div>
```

**Block 4 — note**

```html
<p style="margin:0;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;font-size:14px;font-weight:400;line-height:1.45;color:#7F8B85;white-space:normal;overflow-wrap:break-word;">Every answer comes with the reason behind it — so you learn the rule, not the position of the right option.</p>
```

**Native button:** `Now I get it`

---

## E6 · Mechanism (Polish-only branch)

**Block 1 — title, subtitle:** same as L6 Block 1.

**Block 2 — three feature rows**

```html
<div style="display:flex;flex-direction:column;gap:22px;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <div style="display:flex;align-items:flex-start;gap:14px;">
    <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:40px;height:40px;background:#212C27;border-radius:12px;box-sizing:border-box;"><svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:20px;height:20px;"><line x1="10" x2="14" y1="2" y2="2"></line><line x1="12" x2="15" y1="14" y2="11"></line><circle cx="12" cy="14" r="8"></circle></svg></div>
    <div style="display:flex;flex-direction:column;gap:4px;flex:1 1 auto;min-width:0;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15.5px;font-weight:600;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">The real WORD clock</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13.5px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">20 seconds to read, 15 to answer, 32 questions, 74 points. Mock exams that feel exactly like the day itself — so the day itself feels like practice.</p>
    </div>
  </div>
  <div style="display:flex;align-items:flex-start;gap:14px;">
    <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:40px;height:40px;background:#212C27;border-radius:12px;box-sizing:border-box;"><svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:20px;height:20px;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg></div>
    <div style="display:flex;flex-direction:column;gap:4px;flex:1 1 auto;min-width:0;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15.5px;font-weight:600;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">Your mistakes come back</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13.5px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Every wrong answer lands in your weak spots and returns until you get it right twice in a row. Nothing slips through.</p>
    </div>
  </div>
  <div style="display:flex;align-items:flex-start;gap:14px;">
    <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:40px;height:40px;background:#212C27;border-radius:12px;box-sizing:border-box;"><svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:20px;height:20px;"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg></div>
    <div style="display:flex;flex-direction:column;gap:4px;flex:1 1 auto;min-width:0;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15.5px;font-weight:600;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">All 3,518 official questions</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13.5px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">The full ministry catalogue, sorted into 23 sections — so the question on the day is one you've already seen.</p>
    </div>
  </div>
</div>
```

**Native button:** `Set up my plan`

---

## S7 · How much time can you give this?

**Block 1 — title, subtitle**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">How much time can you give this?</h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Be honest. A plan you can't keep is worse than no plan.</p>
</div>
```

**Native quiz options (title + subtitle):**
- `10 minutes a day` — `Squeezing it in between things`
- `20 minutes a day` — `Steady — most people land here`
- `30+ minutes a day` — `I want this done fast`

**Block 2 — note**

```html
<p style="margin:0;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;font-size:13px;font-weight:400;line-height:1.45;color:#7F8B85;white-space:normal;overflow-wrap:break-word;">A lesson is 10 questions. Nothing here takes an evening.</p>
```

---

## S8 · When's your exam?

**Block 1 — title, subtitle**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">When's your exam at WORD?</h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">We'll pace the plan to have you ready before that date — not on it.</p>
</div>
```

**Native date picker.**

**Block 2 — hint under the picker**

```html
<p style="margin:0;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;font-size:14px;font-weight:600;line-height:1.45;color:#34D399;white-space:normal;overflow-wrap:break-word;">Every day between now and then counts — if you start today.</p>
```

**Native buttons:** `Build my plan` (primary) · `I haven't booked it yet` (secondary)

---

## S9 · Building your plan…

**Block 1 — title + progress + checklist + footnote (one element)**

```html
<div style="display:flex;flex-direction:column;gap:22px;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:28px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">Building your plan…</h1>
  <div style="display:flex;flex-direction:column;gap:10px;">
    <div style="display:flex;justify-content:space-between;align-items:baseline;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:34px;font-weight:700;line-height:1;color:#ECF2EE;">68%</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13px;font-weight:600;color:#7F8B85;">Almost there</p>
    </div>
    <div style="height:8px;border-radius:999px;background:#212C27;overflow:hidden;"><div style="width:68%;height:100%;border-radius:999px;background:#34D399;"></div></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:26px;height:26px;border-radius:999px;background:#34D399;"><svg viewBox="0 0 24 24" fill="none" stroke="#0F1A14" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:14px;height:14px;"><path d="M20 6 9 17l-5-5"></path></svg></div>
      <p style="margin:0;flex:1 1 auto;min-width:0;font-family:Montserrat, system-ui, sans-serif;font-size:15.5px;font-weight:600;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">Your language switched on for every question</p>
    </div>
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:26px;height:26px;border-radius:999px;background:#34D399;"><svg viewBox="0 0 24 24" fill="none" stroke="#0F1A14" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:14px;height:14px;"><path d="M20 6 9 17l-5-5"></path></svg></div>
      <p style="margin:0;flex:1 1 auto;min-width:0;font-family:Montserrat, system-ui, sans-serif;font-size:15.5px;font-weight:600;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">Weak spots go first</p>
    </div>
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="flex:0 0 auto;width:26px;height:26px;border-radius:999px;border:2px solid #33413B;box-sizing:border-box;"></div>
      <p style="margin:0;flex:1 1 auto;min-width:0;font-family:Montserrat, system-ui, sans-serif;font-size:15.5px;font-weight:600;line-height:1.3;color:#7F8B85;overflow-wrap:break-word;">Pacing the lessons to your exam date</p>
    </div>
  </div>
  <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:13px;line-height:1.45;color:#7F8B85;overflow-wrap:break-word;">Matching lessons to your language, your date and your last result.</p>
</div>
```

---

## S10 · Your plan is ready

**Block 1 — eyebrow, title, three stats (one element)**

```html
<div style="display:flex;flex-direction:column;gap:24px;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <div>
    <p style="margin:0 0 10px;font-family:Montserrat, system-ui, sans-serif;font-size:12px;font-weight:700;line-height:1.2;letter-spacing:1px;color:#34D399;">YOUR PLAN IS READY</p>
    <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:32px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">Ready before <span style="color:#5BB4EE;">your exam day.</span></h1>
  </div>
  <div style="display:flex;gap:10px;">
    <div style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:4px;padding:16px 12px;background:#1A231F;border:1px solid #33413B;border-radius:16px;text-align:center;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:24px;font-weight:700;line-height:1;color:#ECF2EE;">3</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:11.5px;line-height:1.3;color:#A3B0A9;">lessons / day</p>
    </div>
    <div style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:4px;padding:16px 12px;background:#1A231F;border:1px solid #33413B;border-radius:16px;text-align:center;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:24px;font-weight:700;line-height:1;color:#ECF2EE;">15</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:11.5px;line-height:1.3;color:#A3B0A9;">min / day</p>
    </div>
    <div style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:4px;padding:16px 12px;background:#1A231F;border:1px solid #33413B;border-radius:16px;text-align:center;">
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:24px;font-weight:700;line-height:1;color:#ECF2EE;">32</p>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:11.5px;line-height:1.3;color:#A3B0A9;">questions in each mock</p>
    </div>
  </div>
</div>
```

**Native button:** `Continue`

---

## S11 · Cost of failing

**Block 1 — title, subtitle**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">A retake costs <span style="color:#F87171;">50 zł</span> and another trip to WORD.</h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">And you walk back into the same 25 minutes, prepared the same way you were the first time.</p>
</div>
```

**Block 2 — two comparison cards (one element)**

```html
<div style="display:flex;flex-direction:column;gap:12px;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <div style="display:flex;flex-direction:column;gap:6px;padding:18px 20px;background:#2A1B1B;border:1px solid #F87171;border-radius:20px;">
    <div style="display:flex;align-items:center;gap:8px;">
      <svg viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:0 0 auto;width:16px;height:16px;"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15px;font-weight:700;color:#F87171;">Sitting it again</p>
    </div>
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:22px;font-weight:700;line-height:1.2;color:#ECF2EE;overflow-wrap:break-word;">50 zł every attempt</p>
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:14px;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Plus the wait for a free slot, and another day off work.</p>
  </div>
  <div style="display:flex;flex-direction:column;gap:6px;padding:18px 20px;background:#16222B;border:1px solid #5BB4EE;border-radius:20px;">
    <div style="display:flex;align-items:center;gap:8px;">
      <svg viewBox="0 0 24 24" fill="none" stroke="#5BB4EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:0 0 auto;width:16px;height:16px;"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
      <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:15px;font-weight:700;color:#5BB4EE;">Preparing properly once</p>
    </div>
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:22px;font-weight:700;line-height:1.2;color:#ECF2EE;overflow-wrap:break-word;">Less than one retake</p>
    <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:14px;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Your language, the real exam clock, mock exams and your weak spots — until the day you pass.</p>
  </div>
</div>
```

**Native button:** `Continue`

---

## S12 · One promise

**Block 1 — title, subtitle**

```html
<div style="width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <h1 style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:30px;font-weight:700;line-height:1.15;letter-spacing:-0.3px;color:#ECF2EE;overflow-wrap:break-word;">One promise before we start.</h1>
  <p style="margin:12px 0 0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">Fifteen minutes a day until your exam. Not more than that. Not zero either.</p>
</div>
```

**Block 2 — promise card**

```html
<div style="display:flex;flex-direction:column;gap:12px;width:100%;box-sizing:border-box;padding:18px 20px;background:#1A231F;border:1px solid #33413B;border-radius:20px;font-family:Montserrat, system-ui, sans-serif;white-space:normal;">
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:28px;height:28px;border-radius:8px;background:#5BB4EE;"><svg viewBox="0 0 24 24" fill="none" stroke="#0F1A14" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:16px;height:16px;"><path d="M20 6 9 17l-5-5"></path></svg></div>
    <p style="margin:0;flex:1 1 auto;min-width:0;font-family:Montserrat, system-ui, sans-serif;font-size:16px;font-weight:700;line-height:1.3;color:#ECF2EE;overflow-wrap:break-word;">I'll show up every day until my exam</p>
  </div>
  <p style="margin:0;font-family:Montserrat, system-ui, sans-serif;font-size:14.5px;line-height:1.45;color:#A3B0A9;overflow-wrap:break-word;">People who set a date and a daily habit are the ones who walk out of WORD with a pass first time. That's the whole trick.</p>
</div>
```

**Native button:** `I'm in — start my free trial`

**Block 3 — fine print under the button**

```html
<p style="margin:0;width:100%;box-sizing:border-box;font-family:Montserrat, system-ui, sans-serif;font-size:12.5px;font-weight:400;line-height:1.45;color:#7F8B85;text-align:center;white-space:normal;overflow-wrap:break-word;">3 days free, then the plan continues. Cancel anytime.</p>
```
