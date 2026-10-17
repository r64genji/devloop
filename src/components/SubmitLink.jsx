import { useState } from "react";
import { Link2 } from "lucide-react";
import Modal from "./Modal";
import { Button, TextField } from "./ui";
import { useFeedActions } from "../store";

const isUrl = (value) => /^https?:\/\/\S+\.\S+/.test(value);

export default function SubmitLink() {
  const { setModal, toast } = useFeedActions();
  const [url, setUrl] = useState("");
  const close = () => setModal(null);

  const submit = (e) => {
    e.preventDefault();
    if (!isUrl(url)) return;
    close();
    toast("Thanks! Your link is in the review queue");
  };

  return (
    <Modal onClose={close} title="Submit a link">
      <form onSubmit={submit} className="p-5">
        <p className="text-muted">Found something worth reading? Share it with the community.</p>
        <TextField
          icon={Link2}
          className="mt-4"
          data-autofocus
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
          aria-label="Article URL"
        />
        <ul className="mt-4 list-inside list-disc space-y-1 text-label text-muted">
          <li>Original articles beat reposts</li>
          <li>No paywalls or sign-up walls</li>
          <li>Squads get first look at submissions</li>
        </ul>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isUrl(url)}>
            Submit link
          </Button>
        </div>
      </form>
    </Modal>
  );
}
