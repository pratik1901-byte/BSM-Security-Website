"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Mail } from "lucide-react";
import { services, site, type ServiceSlug } from "@/lib/site";
import { serviceShortLabels } from "@/lib/navigation";

type Status = "idle" | "composed";

/**
 * Indian mobile number: ten digits beginning 6–9, dialled with +91.
 */
export function isIndianMobile(digits: string) {
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * What the enquiry is about. "General Enquiry" is the default and the first
 * option, so the form never pre-selects a service the visitor did not ask
 * for. The rest are the service categories, under the same short names the
 * menus and the footer use, so BSM reads a familiar label in the message.
 */
const GENERAL = "General Enquiry";
const serviceOptions = [GENERAL, ...services.map((s) => serviceShortLabels[s.slug])];

const fieldCls =
  "w-full rounded-2xl border border-line bg-void px-4 py-3.5 text-sm pointer-coarse:text-base text-bone placeholder:text-dim focus:border-brass focus:shadow-[0_0_0_4px_rgba(200,164,92,0.12)] focus:outline-none focus:ring-0 transition-[border-color,box-shadow] duration-300";
const labelCls = "block font-mono text-[10px] uppercase tracking-[0.2em] text-dim";

/**
 * The enquiry template BSM receives. The visitor's details and enquiry are
 * filled in; anything they left blank stays as an empty line for them to
 * complete in their mail window before sending.
 */
function enquiryEmail(phone: string, message: string, service: string, office: string) {
  const subject = `${service} — ${phone}`;
  const body = [
    "Dear BSM Security Agency,",
    "",
    service === GENERAL
      ? "I would like to make a general enquiry about your services."
      : `I would like to enquire about your ${service} services.`,
    "",
    `Service: ${service}`,
    `Contact number: ${phone}`,
    "Registered office / residential address:",
    office,
    "",
    "Enquiry:",
    message.trim() || "",
    "",
    "Thank you.",
  ].join("\n");

  return { subject, body };
}

/**
 * The enquiry form, used both on the contact page and inside the Request
 * Security drawer. Two fields only: a mandatory contact number and an
 * optional enquiry.
 *
 * This site is a static build with no server behind it, so the form cannot
 * send mail itself. Instead it writes the enquiry into a message addressed to
 * BSM and hands it to the visitor's own mail — Gmail in the browser, or
 * whatever mail app their device uses. The visitor presses Send there, so the
 * message leaves their own account and nothing is ever reported as delivered
 * when it has not been.
 */
export default function EnquiryForm({
  idPrefix = "enquiry",
  rowClass = "",
  onSent,
  children,
}: {
  /** Keeps field ids unique when the form is mounted twice on one page. */
  idPrefix?: string;
  /** Applied to each block, so a parent can stagger them. */
  rowClass?: string;
  onSent?: () => void;
  /** Rendered in the composed state, e.g. a Close button. */
  children?: React.ReactNode;
}) {
  const phoneRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [phoneError, setPhoneError] = useState("");
  const [blocked, setBlocked] = useState("");

  /**
   * Arriving from "Enquire about this service" carries the category in the
   * query — /contact?service=<slug>#enquiry — so the form opens on it. Read
   * from the URL directly rather than through useSearchParams, which would
   * put this static page behind a Suspense boundary for a value that only
   * matters once the page is interactive. An unknown slug is ignored and the
   * form stays on General Enquiry.
   */
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const label = slug ? serviceShortLabels[slug as ServiceSlug] : undefined;
    if (label && serviceRef.current) serviceRef.current.value = label;
  }, []);

  /**
   * Reads and validates the contact number — the one field the enquiry cannot
   * do without, since it is how BSM calls back. Null when it is not usable,
   * and focus goes to it so the visitor lands on what needs fixing.
   */
  function read(form: HTMLFormElement) {
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const digits = (data.phone ?? "").replace(/\D/g, "");
    const office = (data.office ?? "").trim();

    let phoneMsg = "";
    if (!digits) phoneMsg = "A contact number is required so we can call you back.";
    else if (!isIndianMobile(digits))
      phoneMsg = "Enter a 10-digit Indian mobile number, starting 6, 7, 8 or 9.";

    setPhoneError(phoneMsg);

    if (phoneMsg) {
      phoneRef.current?.focus();
      return null;
    }

    setBlocked("");
    return enquiryEmail(`+91${digits}`, data.message ?? "", data.service || GENERAL, office);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const mail = read(e.currentTarget);
    if (!mail) return;

    const url =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      `&to=${encodeURIComponent(site.enquiryInbox)}` +
      `&su=${encodeURIComponent(mail.subject)}` +
      `&body=${encodeURIComponent(mail.body)}`;

    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      setBlocked("Your browser blocked the new window. Allow pop-ups, or use your email app below.");
      return;
    }

    setStatus("composed");
    onSent?.();
  }

  /** Same enquiry, handed to whatever mail app the device uses. */
  function handleMailApp(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const mail = read(form);
    if (!mail) return;

    window.location.href =
      `mailto:${site.enquiryInbox}` +
      `?subject=${encodeURIComponent(mail.subject)}` +
      `&body=${encodeURIComponent(mail.body)}`;
    setStatus("composed");
    onSent?.();
  }

  if (status === "composed") {
    return (
      <div className={`rounded-[1.5rem] border border-brass/40 bg-brass/[0.05] p-8 md:p-10 ${rowClass}`} role="status">
        <span className="icon-tile">
          <Mail className="h-5 w-5" strokeWidth={1.4} />
        </span>
        <h3 className="mt-6 font-display text-title font-semibold text-bone">
          Your enquiry is ready to send.
        </h3>
        <p className="mt-4 max-w-md text-mist">
          A message to {site.enquiryInbox} has opened with your number and enquiry filled in. Press
          Send there and it reaches BSM. If nothing opened, call {site.contact.phone} instead.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          {children}
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass underline underline-offset-4"
          >
            Write another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className={rowClass}>
        <label htmlFor={`${idPrefix}-phone`} className={labelCls}>
          Contact number <span className="text-brass">* required</span>
        </label>
        <div
          className={`mt-3 flex items-stretch overflow-hidden rounded-2xl border ${
            phoneError ? "border-alert" : "border-line"
          } bg-void transition-[border-color,box-shadow] duration-300 focus-within:border-brass focus-within:shadow-[0_0_0_4px_rgba(200,164,92,0.12)]`}
        >
          <span
            className="flex shrink-0 items-center border-r border-line px-4 font-mono text-sm text-mist"
            aria-hidden="true"
          >
            +91
          </span>
          <input
            ref={phoneRef}
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={13}
            required
            aria-required="true"
            aria-invalid={phoneError ? true : undefined}
            aria-describedby={phoneError ? `${idPrefix}-phone-error` : `${idPrefix}-phone-hint`}
            onChange={() => phoneError && setPhoneError("")}
            placeholder="Your mobile number"
            className="w-full bg-transparent px-4 py-3.5 text-sm pointer-coarse:text-base text-bone placeholder:text-dim focus:outline-none"
          />
        </div>
        {phoneError ? (
          <p
            id={`${idPrefix}-phone-error`}
            role="alert"
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-alert"
          >
            {phoneError}
          </p>
        ) : (
          <p
            id={`${idPrefix}-phone-hint`}
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-dim"
          >
            10-digit Indian mobile number
          </p>
        )}
      </div>

      <div className={rowClass}>
        <label htmlFor={`${idPrefix}-office`} className={labelCls}>
          Registered office / Residential address
        </label>
        <textarea
          id={`${idPrefix}-office`}
          name="office"
          rows={2}
          placeholder="Registered office or residential address"
          className={`mt-3 resize-none ${fieldCls}`}
        />
      </div>

      <div className={rowClass}>
        <label htmlFor={`${idPrefix}-service`} className={labelCls}>
          What is this about
        </label>
        <select
          ref={serviceRef}
          id={`${idPrefix}-service`}
          name="service"
          defaultValue={GENERAL}
          className={`mt-3 appearance-none bg-[length:0.7rem] bg-[right_1.1rem_center] bg-no-repeat pr-11 ${fieldCls}`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='%23c8a45c' stroke-width='1.6'%3E%3Cpath d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
          }}
        >
          {serviceOptions.map((option) => (
            <option key={option} value={option} className="bg-void text-bone">
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={rowClass}>
        <label htmlFor={`${idPrefix}-message`} className={labelCls}>
          Enquiry
        </label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={5}
          maxLength={5000}
          placeholder="Your Enquiry here"
          className={`mt-3 resize-none ${fieldCls}`}
        />
      </div>

      {blocked && (
        <div
          role="alert"
          className={`flex items-start gap-3 rounded-2xl border border-alert/50 bg-alert/5 p-4 ${rowClass}`}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-alert" strokeWidth={1.5} />
          <p className="text-sm text-mist">{blocked}</p>
        </div>
      )}

      <div className={`flex flex-wrap items-center gap-5 pt-2 ${rowClass}`}>
        <button
          type="submit"
          className="btn btn-primary"
        >
          <span className="btn-fill" aria-hidden="true" />
          <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
          Send via Gmail
        </button>
        <button
          type="button"
          onClick={handleMailApp}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass underline underline-offset-4"
        >
          Use my email app
        </button>
      </div>
    </form>
  );
}
