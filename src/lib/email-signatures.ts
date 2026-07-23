import { z } from 'zod';

import { emailSignatureProfileSchema, socialPlatformOptions, type EmailSignatureProfile } from '@/schemas/email-signature';

const emailSignatureTemplateSchema = z.object({
  id: z.string().min(1),
  number: z.number().int().min(1).max(10),
  name: z.string().min(1),
  description: z.string().min(1),
  html: z.string().min(1),
});

/**
 * A rendered, Gmail-safe email signature option.
 */
export type EmailSignatureTemplate = z.infer<typeof emailSignatureTemplateSchema>;

const INK = '#17191c';
const GRAPHITE = '#50545a';
const GREEN = '#78d900';
const GREEN_DARK = '#3d7600';
const CONCRETE = '#eef0ec';
const PAPER = '#ffffff';
const STEEL = '#747a82';

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function renderSocialLinks(socials: Array<{ label: string; url: string }>, linkStyle: string, separator: string): string {
  return socials.map(social => `<a href="${social.url}" style="${linkStyle}">${social.label}</a>`).join(separator);
}

function prepareProfile(input: EmailSignatureProfile) {
  const profile = emailSignatureProfileSchema.parse(input);
  const initials = profile.fullName
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return {
    name: escapeHtml(profile.fullName),
    initials: escapeHtml(initials),
    title: escapeHtml(profile.title),
    specialization: escapeHtml(profile.specialization),
    email: escapeHtml(profile.email),
    phone: escapeHtml(profile.phone),
    location: escapeHtml(profile.location),
    website: escapeHtml(profile.website),
    websiteLabel: escapeHtml(new URL(profile.website).hostname.replace(/^www\./, '')),
    socials: profile.socials.map(social => ({
      label: escapeHtml(socialPlatformOptions.find(option => option.value === social.platform)?.label ?? social.platform),
      url: escapeHtml(social.url),
    })),
    phoneHref: escapeHtml(profile.phone.replace(/[^\d+]/g, '')),
    disclaimer: escapeHtml(profile.disclaimer.trim()),
  };
}

/**
 * Generates ten standalone table-based signatures with inline CSS for Gmail.
 */
export function createEmailSignatures(input: EmailSignatureProfile): EmailSignatureTemplate[] {
  const p = prepareProfile(input);
  const link = `color:${GREEN_DARK};text-decoration:underline;font-weight:700;`;
  const terminalLink = `color:${GREEN};text-decoration:underline;`;
  const legal = `font-family:Arial,Helvetica,sans-serif;font-size:9px;line-height:13px;color:${STEEL};`;
  const socialDot = renderSocialLinks(p.socials, link, '&nbsp;&nbsp;·&nbsp;&nbsp;');
  const socialPipe = renderSocialLinks(p.socials, link, ' &nbsp;|&nbsp; ');
  const socialSlash = renderSocialLinks(p.socials, link, ' / ');
  const socialBullet = renderSocialLinks(p.socials, link, ' &nbsp;•&nbsp; ');
  const terminalSocialSlash = renderSocialLinks(p.socials, terminalLink, ' / ');

  const templates: EmailSignatureTemplate[] = [
    {
      id: 'signal-rule',
      number: 1,
      name: 'Signal Rule',
      description: 'A crisp recruiter-friendly stack with a strong green divider.',
      html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <tr><td style="padding:0 0 10px 0;border-bottom:4px solid ${GREEN};">
    <div style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-0.4px;">${p.name}</div>
    <div style="padding-top:3px;font-size:14px;line-height:20px;font-weight:700;">${p.title}</div>
    <div style="font-size:12px;line-height:18px;color:${GRAPHITE};">${p.specialization}</div>
  </td></tr>
  <tr><td style="padding:10px 0 0 0;font-size:12px;line-height:20px;">
    <a href="mailto:${p.email}" style="${link}">${p.email}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="tel:${p.phoneHref}" style="${link}">${p.phone}</a>&nbsp;&nbsp;·&nbsp;&nbsp;${p.location}<br>
    <a href="${p.website}" style="${link}">${p.websiteLabel}</a>${socialDot ? `&nbsp;&nbsp;·&nbsp;&nbsp;${socialDot}` : ''}
  </td></tr>
  <tr><td style="padding-top:12px;${legal}">${p.disclaimer}</td></tr>
</table>`,
    },
    {
      id: 'monogram-rail',
      number: 2,
      name: 'Monogram Rail',
      description: 'A compact initials block creates an immediate visual anchor.',
      html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <tr>
    <td width="76" valign="top" style="width:76px;padding:0 16px 0 0;border-right:2px solid ${INK};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td align="center" valign="middle" width="58" height="58" style="width:58px;height:58px;background:${INK};color:${GREEN};font-family:'Arial Black',Arial,sans-serif;font-size:20px;font-weight:900;">${p.initials}</td></tr></table>
    </td>
    <td valign="top" style="padding:0 0 0 16px;">
      <div style="font-size:20px;line-height:24px;font-weight:800;">${p.name}</div>
      <div style="padding:2px 0 6px;font-size:12px;line-height:17px;color:${GRAPHITE};">${p.title}<br>${p.specialization}</div>
      <div style="font-size:11px;line-height:18px;"><a href="mailto:${p.email}" style="${link}">${p.email}</a> &nbsp;|&nbsp; <a href="tel:${p.phoneHref}" style="${link}">${p.phone}</a><br>${p.location} &nbsp;|&nbsp; <a href="${p.website}" style="${link}">${p.websiteLabel}</a>${socialPipe ? ` &nbsp;|&nbsp; ${socialPipe}` : ''}</div>
    </td>
  </tr>
  <tr><td colspan="2" style="padding-top:12px;${legal}">${p.disclaimer}</td></tr>
</table>`,
    },
    {
      id: 'one-line',
      number: 3,
      name: 'One-Line Compact',
      description: 'The lightest option for active email threads and mobile replies.',
      html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:660px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <tr><td style="padding:0 0 8px 0;font-size:12px;line-height:19px;">
    <strong style="font-size:15px;">${p.name}</strong>&nbsp;&nbsp;<span style="color:${GREEN_DARK};font-weight:700;">//</span>&nbsp;&nbsp;${p.title}<br>
    <span style="color:${GRAPHITE};">${p.specialization}</span><br>
    <a href="mailto:${p.email}" style="${link}">${p.email}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="tel:${p.phoneHref}" style="${link}">${p.phone}</a>&nbsp;&nbsp;·&nbsp;&nbsp;${p.location}&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${p.website}" style="${link}">Portfolio</a>${socialDot ? `&nbsp;&nbsp;·&nbsp;&nbsp;${socialDot}` : ''}
  </td></tr>
  <tr><td style="padding-top:8px;border-top:1px solid #c9cdc7;${legal}">${p.disclaimer}</td></tr>
</table>`,
    },
    {
      id: 'terminal-card',
      number: 4,
      name: 'Terminal Card',
      description: 'A dark technical card that feels at home in engineering conversations.',
      html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;border-collapse:collapse;font-family:'Courier New',Courier,monospace;">
  <tr><td style="padding:16px 18px;background:${INK};border-left:6px solid ${GREEN};color:${PAPER};">
    <div style="font-size:11px;line-height:16px;color:${GREEN};font-weight:700;">AVAILABLE_FOR_NEXT_ROLE=true</div>
    <div style="padding-top:5px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:26px;font-weight:800;">${p.name}</div>
    <div style="padding-top:3px;font-size:12px;line-height:18px;color:#d9ddd7;">${p.title}<br>${p.specialization}</div>
    <div style="padding-top:9px;font-size:11px;line-height:18px;"><a href="mailto:${p.email}" style="${terminalLink}">${p.email}</a> / <a href="tel:${p.phoneHref}" style="${terminalLink}">${p.phone}</a> / ${p.location}<br><a href="${p.website}" style="${terminalLink}">${p.websiteLabel}</a>${terminalSocialSlash ? ` / ${terminalSocialSlash}` : ''}</div>
  </td></tr>
  <tr><td style="padding-top:10px;${legal}">${p.disclaimer}</td></tr>
</table>`,
    },
    {
      id: 'editorial-stack',
      number: 5,
      name: 'Editorial Stack',
      description: 'A spacious, typographic treatment with an understated portfolio feel.',
      html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;border-collapse:collapse;font-family:Georgia,'Times New Roman',serif;color:${INK};">
  <tr><td style="padding:0 0 13px 0;">
    <div style="font-size:28px;line-height:32px;font-weight:700;">${p.name}</div>
    <div style="padding-top:3px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;letter-spacing:1px;text-transform:uppercase;color:${GRAPHITE};">${p.title}</div>
  </td></tr>
  <tr><td style="padding:12px 0;border-top:1px solid ${INK};border-bottom:1px solid ${INK};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;">
    <span style="color:${GRAPHITE};">${p.specialization}</span><br>
    <a href="mailto:${p.email}" style="${link}">${p.email}</a> &nbsp;•&nbsp; <a href="tel:${p.phoneHref}" style="${link}">${p.phone}</a> &nbsp;•&nbsp; ${p.location}<br>
    <a href="${p.website}" style="${link}">${p.websiteLabel}</a>${socialBullet ? ` &nbsp;•&nbsp; ${socialBullet}` : ''}
  </td></tr>
  <tr><td style="padding-top:11px;${legal}">${p.disclaimer}</td></tr>
</table>`,
    },
    {
      id: 'contact-grid',
      number: 6,
      name: 'Contact Grid',
      description: 'A structured two-column layout that makes contact details easy to scan.',
      html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <tr><td colspan="2" style="padding:0 0 10px 0;">
    <div style="font-size:21px;line-height:25px;font-weight:800;">${p.name}</div>
    <div style="font-size:12px;line-height:18px;color:${GRAPHITE};">${p.title} | ${p.specialization}</div>
  </td></tr>
  <tr>
    <td width="50%" style="width:50%;padding:10px 14px;background:${CONCRETE};border:1px solid #c9cdc7;font-size:11px;line-height:18px;">
      <strong style="font-size:9px;letter-spacing:1px;color:${GRAPHITE};">DIRECT</strong><br>
      <a href="mailto:${p.email}" style="${link}">${p.email}</a><br><a href="tel:${p.phoneHref}" style="${link}">${p.phone}</a>
    </td>
    <td width="50%" style="width:50%;padding:10px 14px;background:${CONCRETE};border:1px solid #c9cdc7;font-size:11px;line-height:18px;">
      <strong style="font-size:9px;letter-spacing:1px;color:${GRAPHITE};">ONLINE</strong><br>
      <a href="${p.website}" style="${link}">${p.websiteLabel}</a><br>${p.location}${socialDot ? ` · ${socialDot}` : ''}
    </td>
  </tr>
  <tr><td colspan="2" style="padding-top:11px;${legal}">${p.disclaimer}</td></tr>
</table>`,
    },
    {
      id: 'outlined-card',
      number: 7,
      name: 'Outlined Card',
      description: 'A polished business-card frame with a quiet technical edge.',
      html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <tr><td style="padding:15px 17px;border:2px solid ${INK};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
      <tr>
        <td valign="top"><div style="font-size:22px;line-height:25px;font-weight:800;">${p.name}</div><div style="padding-top:3px;font-size:12px;line-height:18px;color:${GRAPHITE};">${p.title}<br>${p.specialization}</div></td>
        <td width="12" style="width:12px;background:${GREEN};font-size:0;line-height:0;">&nbsp;</td>
      </tr>
      <tr><td colspan="2" style="padding-top:10px;font-size:11px;line-height:18px;"><a href="mailto:${p.email}" style="${link}">${p.email}</a> · <a href="tel:${p.phoneHref}" style="${link}">${p.phone}</a> · ${p.location}<br><a href="${p.website}" style="${link}">${p.websiteLabel}</a>${socialDot ? ` · ${socialDot}` : ''}</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding-top:10px;${legal}">${p.disclaimer}</td></tr>
</table>`,
    },
    {
      id: 'signal-banner',
      number: 8,
      name: 'Signal Banner',
      description: 'A bright availability banner gives the job-search purpose clear emphasis.',
      html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <tr><td style="padding:7px 12px;background:${GREEN};font-size:10px;line-height:14px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">Open to senior frontend and fullstack opportunities</td></tr>
  <tr><td style="padding:13px 12px;background:#f4f5f2;border:1px solid #d7dad4;">
    <div style="font-size:22px;line-height:25px;font-weight:800;">${p.name}</div>
    <div style="padding-top:3px;font-size:12px;line-height:18px;color:${GRAPHITE};">${p.title}<br>${p.specialization}</div>
    <div style="padding-top:8px;font-size:11px;line-height:18px;"><a href="mailto:${p.email}" style="${link}">${p.email}</a> · <a href="tel:${p.phoneHref}" style="${link}">${p.phone}</a> · ${p.location}<br><a href="${p.website}" style="${link}">View portfolio</a>${socialDot ? ` · ${socialDot}` : ''}</div>
  </td></tr>
  <tr><td style="padding-top:10px;${legal}">${p.disclaimer}</td></tr>
</table>`,
    },
    {
      id: 'label-system',
      number: 9,
      name: 'Label System',
      description: 'Small utility labels organize the details like a clean technical résumé.',
      html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;border-collapse:collapse;font-family:'Courier New',Courier,monospace;color:${INK};">
  <tr><td style="padding-bottom:10px;"><span style="font-family:Arial,Helvetica,sans-serif;font-size:23px;line-height:27px;font-weight:800;">${p.name}</span><br><span style="font-size:11px;line-height:17px;color:${GRAPHITE};">${p.title}</span></td></tr>
  <tr><td style="font-size:11px;line-height:19px;">
    <strong style="display:inline-block;color:${GREEN_DARK};">STACK&nbsp;&nbsp;</strong>${p.specialization}<br>
    <strong style="display:inline-block;color:${GREEN_DARK};">EMAIL&nbsp;&nbsp;</strong><a href="mailto:${p.email}" style="${link}">${p.email}</a><br>
    <strong style="display:inline-block;color:${GREEN_DARK};">PHONE&nbsp;&nbsp;</strong><a href="tel:${p.phoneHref}" style="${link}">${p.phone}</a><br>
    <strong style="display:inline-block;color:${GREEN_DARK};">BASE&nbsp;&nbsp;&nbsp;</strong>${p.location}<br>
    <strong style="display:inline-block;color:${GREEN_DARK};">LINKS&nbsp;&nbsp;</strong><a href="${p.website}" style="${link}">portfolio</a>${socialSlash ? ` / ${socialSlash}` : ''}
  </td></tr>
  <tr><td style="padding-top:11px;border-top:1px dashed ${STEEL};${legal}">${p.disclaimer}</td></tr>
</table>`,
    },
    {
      id: 'warm-minimal',
      number: 10,
      name: 'Warm Minimal',
      description: 'A restrained human-first option suited to recruiter and hiring-manager outreach.',
      html: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;border-collapse:collapse;font-family:Verdana,Geneva,sans-serif;color:#252525;">
  <tr><td style="padding:0 0 9px 0;">
    <div style="font-size:18px;line-height:23px;font-weight:700;">${p.name} <span style="color:${GREEN_DARK};">●</span></div>
    <div style="padding-top:3px;font-size:11px;line-height:17px;color:#5e625d;">${p.title}<br>${p.specialization}</div>
  </td></tr>
  <tr><td style="padding:9px 0;border-top:2px solid #252525;font-size:11px;line-height:18px;">
    <a href="mailto:${p.email}" style="${link}">${p.email}</a> &nbsp;|&nbsp; <a href="tel:${p.phoneHref}" style="${link}">${p.phone}</a><br>
    ${p.location} &nbsp;|&nbsp; <a href="${p.website}" style="${link}">${p.websiteLabel}</a>${socialPipe ? ` &nbsp;|&nbsp; ${socialPipe}` : ''}
  </td></tr>
  <tr><td style="padding-top:8px;color:#777b76;font-family:Verdana,Geneva,sans-serif;font-size:8px;line-height:12px;">${p.disclaimer}</td></tr>
</table>`,
    },
  ];

  return z.array(emailSignatureTemplateSchema).length(10).parse(templates);
}
