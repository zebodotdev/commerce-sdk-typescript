import type { JSONData, JSONValue } from './custom-data';

export const MessageTemplateChannels = { Sms: 'sms', Email: 'email' } as const;
export type MessageTemplateChannel =
  (typeof MessageTemplateChannels)[keyof typeof MessageTemplateChannels];

export const MessageTemplateStatuses = {
  Draft: 'draft',
  Published: 'published',
  Archived: 'archived',
} as const;
export type MessageTemplateStatus =
  (typeof MessageTemplateStatuses)[keyof typeof MessageTemplateStatuses];

export const MessageTemplateVariableTypes = {
  String: 'string',
  Number: 'number',
  Integer: 'integer',
  Boolean: 'boolean',
  Url: 'url',
  Email: 'email',
  Phone: 'phone',
  Date: 'date',
  Datetime: 'datetime',
  Array: 'array',
} as const;
export type MessageTemplateVariableType =
  (typeof MessageTemplateVariableTypes)[keyof typeof MessageTemplateVariableTypes];

export const MessageTemplateVariableItemTypes = {
  String: 'string',
  Number: 'number',
  Integer: 'integer',
  Boolean: 'boolean',
  Url: 'url',
  Email: 'email',
  Phone: 'phone',
  Date: 'date',
  Datetime: 'datetime',
} as const;
export type MessageTemplateVariableItemType =
  (typeof MessageTemplateVariableItemTypes)[keyof typeof MessageTemplateVariableItemTypes];

export const ContentSafetyStatuses = {
  Allowed: 'allowed',
  Rejected: 'rejected',
  Quarantined: 'quarantined',
} as const;
export type ContentSafetyStatus =
  (typeof ContentSafetyStatuses)[keyof typeof ContentSafetyStatuses];

export interface MessageTemplateVariable {
  name: string;
  type: MessageTemplateVariableType;
  about?: string;
  default?: JSONValue;
  items?: MessageTemplateVariableItem[];
  required?: boolean;
}

export interface MessageTemplateVariableItem {
  name: string;
  type: MessageTemplateVariableItemType;
  about?: string;
  default?: JSONValue;
  required?: boolean;
}

export interface MessageTemplateSmsContent {
  messageTemplate: string;
}

export interface MessageTemplateMailbox {
  address?: string;
  name?: string;
}

export type MessageHeaders = Readonly<Record<string, string>>;

export interface MessageTemplateEmailContent {
  from?: MessageTemplateMailbox | null;
  headers?: MessageHeaders;
  html: string;
  replyTo?: MessageTemplateMailbox | null;
  subject: string;
}

export interface MessageTemplate {
  id: string;
  about?: string | null;
  archivedAt?: string | null;
  attachments?: string[];
  channel: MessageTemplateChannel;
  createdAt: string;
  draftVersion: number;
  email?: MessageTemplateEmailContent | null;
  hasUnpublishedChanges: boolean;
  locale: string;
  name: string;
  publishedAt?: string | null;
  publishedVersion?: number | null;
  purpose: string;
  sms?: MessageTemplateSmsContent | null;
  status: MessageTemplateStatus;
  updatedAt: string;
  variables?: MessageTemplateVariable[];
  version: number;
}

export interface MessageTemplateCreateRequest {
  name: string;
  channel: MessageTemplateChannel;
  purpose: string;
  about?: string;
  attachments?: string[];
  email?: MessageTemplateEmailContent;
  locale?: string;
  sms?: MessageTemplateSmsContent;
  variables?: MessageTemplateVariable[];
}

export interface MessageTemplateUpdateRequest {
  id: string;
  about?: string;
  attachments?: string[];
  channel?: MessageTemplateChannel;
  email?: MessageTemplateEmailContent;
  locale?: string;
  name?: string;
  purpose?: string;
  sms?: MessageTemplateSmsContent;
  variables?: MessageTemplateVariable[];
}

export interface MessageTemplateActionRequest {
  id: string;
}

export interface MessageTemplateLookupRequest {
  id: string;
}

export interface MessageTemplatePageRequest {
  channel?: MessageTemplateChannel;
  locale?: string;
  page?: number;
  purpose?: string;
  size?: number;
  status?: MessageTemplateStatus;
}

export interface MessageTemplateReference {
  templateId: string;
  variables?: JSONData;
}

export interface MessageTemplateRenderPreviewRequest {
  messageTemplate: MessageTemplateReference;
}

export interface MessageTemplatePage {
  number?: number;
  size?: number;
  messageTemplates?: MessageTemplate[];
}

export interface MessageTemplateRenderedContent {
  channel: MessageTemplateChannel;
  attachments?: string[];
  email?: RenderedEmailMessageTemplate;
  sms?: {
    fullMessage?: string;
  };
}

export interface MessageTemplateSafetyResult {
  contentHash?: string;
  links?: MessageTemplateScannedLink[];
  normalizedText?: string;
  quarantineNotes?: string;
  reasonCodes?: string[];
  sanitizedHtml?: string;
  scanner?: string;
  status?: ContentSafetyStatus;
}

export interface MessageTemplateScannedLink {
  host?: string;
  raw?: string;
  reason?: string;
  scheme?: string;
  status?: string;
}

export interface RenderedEmailMessageTemplate {
  subject?: string;
  text?: string;
  html?: string | null;
  from?: MessageTemplateMailbox;
  replyTo?: MessageTemplateMailbox;
  headers?: MessageHeaders;
  safety?: MessageTemplateSafetyResult;
}

export interface MessageTemplatePreview {
  messageTemplate: MessageTemplate;
  rendered: MessageTemplateRenderedContent;
}
