/** @type {import('tailwindcss').Config} */
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Finance Tracker design system. Theme-dependent colours come from CSS
      // variables (see index.css) so the light/dark toggle only flips one class.
      colors: {
        page: themed("page"),
        surface: themed("surface"),
        raised: themed("raised"),
        line: themed("line"),
        control: themed("control"),
        strong: themed("strong"),
        ink: themed("ink"),
        muted: themed("muted"),
        primary: themed("primary"),
        "on-primary": themed("on-primary"),
        link: themed("link"),
        focus: themed("focus"),
        error: themed("error"),
        "on-error": themed("on-error"),
        // Same in both themes
        brand: "#6FA8F0",
        "on-brand": "#0B2340",
        // Light-theme neutrals, used where an illustration must look the same in both themes
        cream: "#FBF6EC",
        sand: "#F1ECE1",
        "sand-line": "#D3CAB8",
        mist: "#A8B4C2",
        sticker: {
          ok: "#CDEBD3",
          tight: "#FFE08A",
          over: "#F6C3C0",
          ink: "#1F1A10",
        },
        // Reading-budget bar (solid fills; the design system's only status colours)
        health: {
          good: "#7CCB95",
          tight: "#F5C93A",
          over: "#EE8A84",
        },
        // Category colours: solid fills behind white icons/letters only
        cat: {
          "eating-out": "#B65F35",
          groceries: "#698728",
          transport: "#00917A",
          shopping: "#AF5987",
          home: "#A86B02",
          bills: "#746EC1",
          subscriptions: "#008F9B",
          education: "#8C65B5",
          entertainment: "#927800",
          health: "#B9585B",
          travel: "#0087B4",
          gifts: "#9F5EA3",
          income: "#398E51",
          transfers: "#708298",
          other: "#7D8086",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      // Type scale from the design system (weights are set with font-* classes)
      fontSize: {
        hero: ["76px", { lineHeight: "0.9", letterSpacing: "-0.05em" }],
        headline: ["28px", { lineHeight: "34px", letterSpacing: "-0.02em" }],
        title: ["22px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        button: ["16px", "20px"],
        body: ["15px", "22px"],
        label: ["13px", "18px"],
        caption: ["12px", "16px"],
        overline: ["12px", { lineHeight: "16px", letterSpacing: "0.08em" }],
      },
      // Layout sizes (not part of the 4px spacing steps used for margins and gaps)
      spacing: {
        header: "72px",
        rail: "60px",
        "nav-clear": "104px", // bottom padding that clears the mobile tab bar
      },
      rotate: {
        "tilt-left": "-3deg",
        "tilt-right": "2deg",
        "tilt-soft": "-2deg",
      },
      borderWidth: {
        sticker: "1.5px",
      },
      zIndex: {
        toast: "60",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
        drop: {
          "0%": { opacity: "0", transform: "translateY(-6px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 300ms ease-out",
        drop: "drop 140ms ease-out",
        rise: "rise 200ms ease-out",
      },
    },
  },
  plugins: [],
};
