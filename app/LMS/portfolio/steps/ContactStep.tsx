"use client";

import { useState } from "react";
import {
  CV_CONTENT_TYPE,
  CV_MAX_UPLOAD_BYTES,
  uploadCv,
} from "utils/portfolio/cvUpload";
import styles from "./ContactStep.module.css";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  return Math.round(bytes / 1024) + " KB";
}

import type { PortfolioContent } from "types/portfolioTypes";

type ContactProps = {
  contact?: PortfolioContent["contact"];
  updateContact?: (changes: Partial<PortfolioContent["contact"]>) => void;
  ready?: boolean;
};

export default function ContactStep({ contact, updateContact, ready = true }: ContactProps = {}) {
  const [email, setEmail] = useState("");
  const [showEmailPublicly, setShowEmailPublicly] = useState(false);
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [localCvUrl, setLocalCvUrl] = useState("");
  const cvUrl = contact ? contact.cvUrl ?? "" : localCvUrl;
  function setCvUrl(url: string) {
    setLocalCvUrl(url);
    updateContact?.({ cvUrl: url });
  }
  const [cvFileName, setCvFileName] = useState("");
  const [cvFileSize, setCvFileSize] = useState<number | null>(null);

  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvError, setCvError] = useState("");

  const handleCvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setCvError("");
    if (file.type !== CV_CONTENT_TYPE) {
      setCvError("Please choose a PDF file.");
      return;
    }
    if (file.size > CV_MAX_UPLOAD_BYTES) {
      setCvError("Your CV must be 5 MB or smaller.");
      return;
    }

    setUploadingCv(true);
    try {
      const url = await uploadCv(file);
      setCvUrl(url);
      setCvFileName(file.name);
      setCvFileSize(file.size);

    } catch {
      setCvError("The CV could not be uploaded. Please try again.");
    } finally {
      setUploadingCv(false);
    }
  };

  function removeCvFromPortfolio() {
    setCvUrl("");
    setCvFileName("");
    setCvFileSize(null);

    setCvError("");
  }

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <label className={styles.field}>
        <span>Email (optional)</span>
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (!event.target.value.trim()) setShowEmailPublicly(false);
          }}
          placeholder="you@example.com"
        />
        <small>Your email is private unless you choose to show it on your portfolio.</small>
      </label>

      <label className={styles.toggleRow}>
        <span>Show e-mail address publicly</span>
        <input
          type="checkbox"
          checked={showEmailPublicly}
          disabled={!email.trim()}
          onChange={(event) => setShowEmailPublicly(event.target.checked)}
        />
      </label>

      <label className={styles.field}>
        <span>LinkedIn</span>
        <input
          type="url"
          value={linkedin}
          onChange={(event) => setLinkedin(event.target.value)}
          placeholder="https://www.linkedin.com/in/your-name"
        />
      </label>

      <label className={styles.field}>
        <span>GitHub</span>
        <input
          type="url"
          value={github}
          onChange={(event) => setGithub(event.target.value)}
          placeholder="https://github.com/your-name"
        />
      </label>

      <div className={styles.field}>
        <span>CV (optional)</span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          aria-label="Upload CV"
          aria-describedby="cv-hint"
          disabled={uploadingCv || !ready}
          onChange={handleCvUpload}
        />
        <small id="cv-hint">PDF only, up to 5 MB. Anyone with the uploaded link can access the file.</small>
        {uploadingCv && <small role="status">Uploading CV…</small>}
        {cvError && <small className={styles.error} role="alert">{cvError}</small>}

        {cvUrl && (
          <div className={styles.uploadedFile}>
            <div className={styles.fileInfo}>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                {cvFileName || "View uploaded CV"}
              </a>
              {cvFileSize !== null && <small>{formatFileSize(cvFileSize)} · uploaded</small>}
            </div>
            <button type="button" className={styles.removeButton} onClick={removeCvFromPortfolio}>
              Remove
            </button>
          </div>
        )}
      </div>

      <p className={styles.note}>
        Add only the contact links you want to share. Your uploaded CV link is saved in your draft.
      </p>
    </form>
  );
}
