import { useState, useEffect, useRef } from "react";

const PRODUCTS = {
  og: { name: "The OG Holey Hiker Backpacking Bidet", url: "https://holeyhiker.com", ribbon: "The Classic", emoji: "🏆" },
  thruHiker: { name: "Thru Hiker Bidet", url: "https://holeyhiker.com", ribbon: "Thru Hiker Approved", emoji: "🥾" },
  everyDay: { name: "The Every Day Bidet", url: "https://holeyhiker.com", ribbon: "For Every Single Day", emoji: "📅" },
  leftHanded: { name: "The Left-Handed Bidet", url: "https://holeyhiker.com", ribbon: "The Resistance Has a Product Now", emoji: "✊" },
  lumberjack: { name: "I Wanna Be a Lumberjack Bidet", url: "https://holeyhiker.com", ribbon: "Perfect for Monty Python Fans", emoji: "🪓" },
  brickBuilder: { name: "Bidet for Brick Builders", url: "https://holeyhiker.com", ribbon: "Satisfying Click Not Included", emoji: "🧱" },
  bugOut: { name: "Bug Out Bag Bidet", url: "https://holeyhiker.com", ribbon: "Perfect for Preppers", emoji: "🎒" },
  barkLee: { name: "Bark Lee Ultramarathon Chafe Slaying Bidet", url: "https://holeyhiker.com", ribbon: "Chafe Slayer", emoji: "🏃" },
  cyclist: { name: "One More Hill Bidet", url: "https://holeyhiker.com", ribbon: "For Cyclists", emoji: "🚴" },
  beachBum: { name: "Beach Bum Bidet", url: "https://holeyhiker.com", ribbon: "Sand In Places You Don't Want", emoji: "🏖️" },
  poopyKid: { name: "Parent of a Poopy Kid Bidet", url: "https://holeyhiker.com", ribbon: "You Know Why", emoji: "👶" },
  purpleRain: { name: "Purple Rain Bidet", url: "https://holeyhiker.com", ribbon: "Party Like It's 1999", emoji: "💜" },
  blastmaster: { name: "BlastMaster 3000", url: "https://holeyhiker.com", ribbon: "For Hard Hat Hygiene", emoji: "🦺" },
  cnoc: { name: "Squeeze and Please CNOC Package", url: "https://holeyhiker.com", ribbon: "You Asked. Repeatedly.", emoji: "🫸" },
  threepack: { name: "3 for $33", url: "https://holeyhiker.com", ribbon: "Welcome to the Ministry", emoji: "🙌" },
};

const QUESTIONS = [
  {
    id: "handedness",
    text: "Which hand do you use to wave at strangers?",
    subtext: "Be honest. This matters more than you know.",
    options: [
      { label: "Right hand, like the world intended", value: "right" },
      { label: "Left hand, in quiet defiance", value: "left" },
      { label: "Both? I'm ambidextrous and chaotic", value: "both" },
    ],
  },
  {
    id: "peanutButter",
    text: "Peanut butter on apples: yes or no?",
    subtext: "There is no neutral position on this.",
    options: [
      { label: "YES. Obviously. It's delicious.", value: "yes" },
      { label: "No. Apples are complete.", value: "no" },
      { label: "I have an avocado allergy so I don't trust fruit", value: "avocado" },
    ],
  },
  {
    id: "squirrels",
    text: "You're in a park. A squirrel makes eye contact. Your self-confidence:",
    subtext: "The squirrel has opinions about you.",
    options: [
      { label: "Takes a dive. That squirrel KNOWS things.", value: "dive" },
      { label: "Fine. I stare back. I don't negotiate with rodents.", value: "fine" },
      { label: "Skyrockets. I am one with nature.", value: "soars" },
    ],
  },
  {
    id: "crowdedRoom",
    text: "You're in a crowded room. Someone asks 'who here uses a bidet?' What do you do?",
    subtext: "Be honest. The room is watching.",
    options: [
      { label: "Hand shoots up. Eye contact maintained. No hesitation.", value: "evangelist" },
      { label: "Raise it slowly while looking around to see who else is raising theirs.", value: "committed" },
      { label: "Shrink into your chair. You use one. You will never admit this here.", value: "secret" },
      { label: "Stand up and begin a presentation you did not prepare but have been ready to give your whole life.", value: "unhinged" },
      { label: "Raise your left hand specifically.", value: "lefthand" },
    ],
  },
  {
    id: "gramCount",
    text: "Do you weigh your gear before a trip?",
    subtext: "Every gram is a choice.",
    options: [
      { label: "I weigh everything including the stuff sack label", value: "obsessed" },
      { label: "I try to keep it light-ish", value: "casual" },
      { label: "I bring what I need and accept the consequences", value: "yolo" },
    ],
  },
  {
    id: "catsOrDogs",
    text: "Cats or dogs?",
    subtext: "The correct answer says a lot about your relationship with chaos.",
    options: [
      { label: "Dogs. Loyal. Predictable. Good.", value: "dogs" },
      { label: "Cats. Independent. Judgy. Correct.", value: "cats" },
      { label: "I have goats actually", value: "goats" },
    ],
  },
  {
    id: "apocalypse",
    text: "The grid goes down tomorrow. Your first move is:",
    subtext: "Not hypothetical. Be ready.",
    options: [
      { label: "Open my carefully organized prep storage", value: "prepper" },
      { label: "Call my most outdoorsy friend", value: "thruHiker" },
      { label: "Honestly? Panic. Then adapt.", value: "adapt" },
      { label: "Find the nearest beach, it's fine", value: "beach" },
    ],
  },
];

const SYSTEM_PROMPT = `You are the Holey Hiker Bidet Quiz Oracle. You are irreverent, absurdist, genuinely warm, and you run a one-man bidet operation out of a garage in Connecticut.

Based on the user's quiz answers, recommend exactly ONE product from this list. Return ONLY valid JSON — no markdown, no backticks, no extra text.

Products available:
- og: The OG Holey Hiker Backpacking Bidet (classic, works on Smartwater bottle, the original)
- thruHiker: Thru Hiker Bidet (for people doing big miles, serious about finishing)
- everyDay: The Every Day Bidet (works for right AND left handed, works everywhere, available in yellow only)
- leftHanded: The Left-Handed Bidet (for lefties, the resistance has a product now)
- lumberjack: I Wanna Be a Lumberjack Bidet (for people who drive Subarus, wear flannel, drink kombucha)
- brickBuilder: Bidet for Brick Builders (for LEGO/Brick enthusiasts)
- bugOut: Bug Out Bag Bidet (for preppers, grid-down scenarios)
- barkLee: Bark Lee Ultramarathon Chafe Slaying Bidet (for runners doing long distances)
- cyclist: One More Hill Bidet (for cyclists and bikepackers)
- beachBum: Beach Bum Bidet (for beach people, sand removal, underrated)
- purpleRain: Purple Rain Bidet (for people who have strong aesthetic opinions and appreciation for Prince)
- blastmaster: BlastMaster 3000 (for construction workers, hard hat crowd)
- threepack: 3 for $33 (for evangelists who can't stop talking about it)

Return this exact JSON format:
{
  "product": "productKey",
  "headline": "A short absurdist headline for the recommendation (1 sentence, funny)",
  "reasoning": "2-3 sentences in Paul's voice explaining why this person got this bidet. Reference their specific answers. Be funny. Be real. Break the fourth wall once.",
  "signoff": "A one-line sign-off from the garage in Connecticut"
}`;

export default function HoleyHikerQuiz() {
  const [phase, setPhase] = useState("intro"); // intro | quiz | loading | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [animating, setAnimating] = useState(false);
  const resultRef = useRef(null);

  const question = QUESTIONS[currentQ];
  const progress = (currentQ / QUESTIONS.length) * 100;

  function handleAnswer(value) {
    if (animating) return;
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    setAnimating(true);

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
        setAnimating(false);
      } else {
        setPhase("loading");
        fetchRecommendation(newAnswers);
      }
    }, 350);
  }

  async function fetchRecommendation(finalAnswers) {
    const summary = QUESTIONS.map((q) => {
      const ans = finalAnswers[q.id];
      const option = q.options.find((o) => o.value === ans);
      return `${q.text} → ${option?.label || ans}`;
    }).join("\n");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Quiz answers:\n${summary}` }],
        }),
      });
      const data = await response.json();
      const raw = data.content?.find((b) => b.type === "text")?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResult(parsed);
      setPhase("result");
    } catch (e) {
      setError("Something went wrong in the garage. Refresh and try again.");
      setPhase("result");
    }
  }

  const product = result ? PRODUCTS[result.product] : null;

  return (
    <div style={styles.root}>
      <div style={styles.grain} />

      {phase === "intro" && (
        <div style={styles.card}>
          <div style={styles.logo}>🚿</div>
          <h1 style={styles.title}>Which Bidet Are You?</h1>
          <p style={styles.subtitle}>
            A deeply scientific personality assessment from the garage in Connecticut.
          </p>
          <p style={styles.body}>
            Seven questions stand between you and the bidet destiny you didn't know you were owed.
            Some questions will seem unrelated to butt hygiene. They are not.
          </p>
          <button style={styles.btn} onClick={() => setPhase("quiz")}>
            I'm Ready for My Truth
          </button>
          <p style={styles.fine}>No peanut butter was harmed in the making of this quiz.</p>
        </div>
      )}

      {phase === "quiz" && question && (
        <div style={{ ...styles.card, opacity: animating ? 0 : 1, transition: "opacity 0.3s ease" }}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <div style={styles.qCount}>
            Question {currentQ + 1} of {QUESTIONS.length}
          </div>
          <h2 style={styles.question}>{question.text}</h2>
          <p style={styles.qSub}>{question.subtext}</p>
          <div style={styles.options}>
            {question.options.map((opt) => (
              <button
                key={opt.value}
                style={styles.optBtn}
                onClick={() => handleAnswer(opt.value)}
                onMouseEnter={(e) => (e.target.style.background = "#f5f0e8")}
                onMouseLeave={(e) => (e.target.style.background = "white")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "loading" && (
        <div style={styles.card}>
          <div style={styles.loadingEmoji}>🚿</div>
          <h2 style={styles.loadingText}>Consulting the garage...</h2>
          <p style={styles.body}>Paul is reviewing your psychological profile.</p>
          <div style={styles.dots}>
            <span style={{ ...styles.dot, animationDelay: "0s" }} />
            <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
            <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
          </div>
        </div>
      )}

      {phase === "result" && (
        <div style={styles.card} ref={resultRef}>
          {error ? (
            <p style={styles.error}>{error}</p>
          ) : product && result ? (
            <>
              <div style={styles.resultEmoji}>{product.emoji}</div>
              <div style={styles.ribbon}>{product.ribbon}</div>
              <h2 style={styles.resultTitle}>{product.name}</h2>
              <p style={styles.headline}>{result.headline}</p>
              <div style={styles.divider} />
              <p style={styles.reasoning}>{result.reasoning}</p>
              <p style={styles.signoff}>— {result.signoff}</p>
              <a
                href="https://holeyhiker.com"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.buyBtn}
              >
                Get My Bidet →
              </a>
              <button
                style={styles.retakeBtn}
                onClick={() => {
                  setPhase("intro");
                  setCurrentQ(0);
                  setAnswers({});
                  setResult(null);
                  setError(null);
                }}
              >
                Retake (Different Answers Won't Help You)
              </button>
            </>
          ) : null}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500&display=swap');
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#fdf8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    padding: "20px",
    position: "relative",
  },
  grain: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    pointerEvents: "none",
    zIndex: 0,
  },
  card: {
    background: "white",
    borderRadius: "4px",
    border: "2px solid #1a1a1a",
    padding: "48px 40px",
    maxWidth: "560px",
    width: "100%",
    boxShadow: "8px 8px 0 #1a1a1a",
    position: "relative",
    zIndex: 1,
    animation: "fadeUp 0.5s ease both",
  },
  logo: { fontSize: "48px", textAlign: "center", marginBottom: "16px" },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "36px",
    fontWeight: 900,
    textAlign: "center",
    margin: "0 0 8px",
    color: "#1a1a1a",
    lineHeight: 1.1,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    marginBottom: "24px",
    fontStyle: "italic",
  },
  body: {
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#333",
    marginBottom: "32px",
    textAlign: "center",
  },
  btn: {
    display: "block",
    width: "100%",
    background: "#f5c842",
    color: "#1a1a1a",
    border: "2px solid #1a1a1a",
    borderRadius: "2px",
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    boxShadow: "4px 4px 0 #1a1a1a",
    transition: "transform 0.1s, box-shadow 0.1s",
    marginBottom: "12px",
  },
  fine: { textAlign: "center", fontSize: "11px", color: "#aaa", margin: 0 },
  progressBar: {
    height: "4px",
    background: "#eee",
    borderRadius: "2px",
    marginBottom: "24px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#f5c842",
    transition: "width 0.4s ease",
    borderRadius: "2px",
  },
  qCount: { fontSize: "11px", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" },
  question: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "26px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "8px",
    lineHeight: 1.2,
  },
  qSub: { fontSize: "13px", color: "#888", fontStyle: "italic", marginBottom: "28px" },
  options: { display: "flex", flexDirection: "column", gap: "10px" },
  optBtn: {
    background: "white",
    border: "2px solid #1a1a1a",
    borderRadius: "2px",
    padding: "14px 18px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    color: "#1a1a1a",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s",
    boxShadow: "3px 3px 0 #1a1a1a",
  },
  loadingEmoji: {
    fontSize: "56px",
    textAlign: "center",
    marginBottom: "16px",
    animation: "bounce 1.2s ease-in-out infinite",
  },
  loadingText: {
    fontFamily: "'Playfair Display', serif",
    textAlign: "center",
    fontSize: "28px",
    margin: "0 0 8px",
  },
  dots: { display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" },
  dot: {
    width: "10px",
    height: "10px",
    background: "#f5c842",
    borderRadius: "50%",
    border: "2px solid #1a1a1a",
    display: "inline-block",
    animation: "pulse 1s ease-in-out infinite",
  },
  resultEmoji: { fontSize: "56px", textAlign: "center", marginBottom: "8px" },
  ribbon: {
    textAlign: "center",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#888",
    marginBottom: "8px",
  },
  resultTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "30px",
    fontWeight: 900,
    textAlign: "center",
    color: "#1a1a1a",
    margin: "0 0 16px",
    lineHeight: 1.15,
  },
  headline: {
    textAlign: "center",
    fontSize: "15px",
    fontStyle: "italic",
    color: "#444",
    marginBottom: "20px",
    lineHeight: 1.5,
  },
  divider: { height: "2px", background: "#1a1a1a", margin: "20px 0" },
  reasoning: { fontSize: "15px", lineHeight: 1.75, color: "#333", marginBottom: "16px" },
  signoff: {
    fontSize: "13px",
    color: "#888",
    fontStyle: "italic",
    marginBottom: "28px",
    borderLeft: "3px solid #f5c842",
    paddingLeft: "12px",
  },
  buyBtn: {
    display: "block",
    background: "#f5c842",
    color: "#1a1a1a",
    border: "2px solid #1a1a1a",
    borderRadius: "2px",
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: 700,
    textAlign: "center",
    textDecoration: "none",
    boxShadow: "4px 4px 0 #1a1a1a",
    marginBottom: "12px",
  },
  retakeBtn: {
    display: "block",
    width: "100%",
    background: "transparent",
    color: "#999",
    border: "none",
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    padding: "8px",
  },
  error: { color: "red", textAlign: "center" },
