import { envConfig } from "@/config/env";
import { site } from "@/config/site";

export enum SubscriptionStatusEnum {
  SUBSCRIBED = "subscribed",
  ALREADY_SUBSCRIBED = "already-subscribed",
}

const CONFIRMED = "Inscrição confirmada.";
const ALREADY = "Este e-mail já está inscrito.";
const FAILED = "Não foi possível inscrever. Tente de novo.";

export interface ISubscribePayload {
  email: string;
  website: string;
}

export interface INewsletterOk {
  ok: true;
  status: SubscriptionStatusEnum;
  message: string;
}

export interface INewsletterErr {
  ok: false;
  message: string;
  status?: SubscriptionStatusEnum;
}

export type NewsletterResult = INewsletterOk | INewsletterErr;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SUBSCRIBE_MS = 10_000;

const website = new URL(site.url).hostname.replace(/^www\./, "");

export const newsletterWebsite = website;

const newsletterApiBase = (process.env.NEXT_PUBLIC_NEWSLETTER_API_BASE || envConfig.apiBaseUrl).replace(/\/$/, "");

export const newsletterEndpoint = `${newsletterApiBase}/subscriptions/subscribe`;

export const isValidEmail = (email: string): boolean => EMAIL_RE.test(email.trim());

const bodyMessage = (body: unknown): string => {
  if (typeof body === "string") return body;
  if (typeof body !== "object" || body === null) return "";

  if ("message" in body && body.message) return String(body.message);

  if ("errors" in body && Array.isArray(body.errors)) {
    const first: unknown = body.errors[0];
    if (typeof first === "object" && first !== null && "msg" in first && first.msg) {
      return String(first.msg);
    }
  }

  return "";
};

const isAlreadySubscribedResponse = (status: number, body: unknown): boolean => {
  if (status === 409) return true;
  return /already\s*subscribed|already\s*exists|duplicat|já\s*inscrit|ja\s*inscrit/i.test(bodyMessage(body));
};

export const subscribeNewsletter = async (email: string): Promise<NewsletterResult> => {
  const trimmedEmail = email.trim();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBSCRIBE_MS);
  const payload: ISubscribePayload = {
    email: trimmedEmail,
    website: newsletterWebsite,
  };

  try {
    const res = await fetch(newsletterEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let body: unknown;
    try {
      const text = (await res.text()).trim();
      body = text ? (JSON.parse(text) as unknown) : null;
    } catch {
      body = null;
    }

    if (res.status === 201 || res.status === 200) {
      return { ok: true, status: SubscriptionStatusEnum.SUBSCRIBED, message: CONFIRMED };
    }

    if (res.status === 404 || res.status === 500) return { ok: false, message: FAILED };

    if (isAlreadySubscribedResponse(res.status, body)) {
      return { ok: false, status: SubscriptionStatusEnum.ALREADY_SUBSCRIBED, message: ALREADY };
    }

    return { ok: false, message: bodyMessage(body) || FAILED };
  } catch {
    return { ok: false, message: FAILED };
  } finally {
    clearTimeout(timer);
  }
};
