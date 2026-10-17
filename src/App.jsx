import { useEffect } from "react";
import Header from "./components/Header";
import { Sidebar, MobileNav } from "./components/Sidebar";
import FeedToolbar from "./components/toolbar/FeedToolbar";
import ShortcutsRow from "./components/ShortcutsRow";
import Feed from "./components/Feed";
import PostModal from "./components/PostModal";
import CommandPalette from "./components/CommandPalette";
import FeedSettings from "./components/FeedSettings";
import SubmitLink from "./components/SubmitLink";
import Toaster from "./components/Toaster";
import FeedbackButton from "./components/FeedbackButton";
import { FeedProvider, useFeed } from "./store";

const dialogs = {
  search: CommandPalette,
  settings: FeedSettings,
  submit: SubmitLink,
};

function Shell() {
  const { view, modal, setModal, openPostId, showShortcuts } = useFeed();
  const Dialog = dialogs[modal];

  // Ctrl/Cmd + K, or "/" outside a text field, opens search. Ignored while
  // another dialog (settings, submit) is open so it never replaces it.
  useEffect(() => {
    const onKey = (e) => {
      if (modal) return;
      const typing = ["INPUT", "TEXTAREA"].includes(e.target.tagName);
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing && openPostId == null)) {
        e.preventDefault();
        setModal("search");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal, openPostId, setModal]);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1 px-5 pb-nav-clear pt-8 md:px-8 md:pb-10 lg:px-10 lg:pt-10">
          <div className="mx-auto max-w-screen-2xl">
            <FeedToolbar />
            {view === "feed" && showShortcuts && <ShortcutsRow />}
            <Feed />
          </div>
        </main>
      </div>

      <MobileNav />
      <FeedbackButton />
      <Toaster />

      {openPostId != null && <PostModal />}
      {Dialog && <Dialog />}
    </div>
  );
}

export default function App() {
  return (
    <FeedProvider>
      <Shell />
    </FeedProvider>
  );
}
