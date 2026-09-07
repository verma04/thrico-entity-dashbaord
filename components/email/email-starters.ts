export const TEMPLATE_VARIABLES = [
  { tag: "{{member_name}}", label: "Member Name", desc: "e.g. John Doe" },
  { tag: "{{member_email}}", label: "Member Email", desc: "e.g. user@example.com" },
  { tag: "{{entity_name}}", label: "Community / Org Name", desc: "e.g. Acme Network" },
  { tag: "{{login_url}}", label: "Login / Action URL", desc: "e.g. https://thrico.network/login" },
  { tag: "{{approval_status}}", label: "Approval Status", desc: "e.g. Approved / Active" },
  { tag: "{{dashboard_url}}", label: "Dashboard Link", desc: "e.g. https://thrico.network/dashboard" },
];

export function getDefaultStarter(type: "welcome" | "approval" | "custom"): string {
  if (type === "approval") {
    return `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 36px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                    🎉 You're Approved!
                  </h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">
                    Welcome to {{entity_name}}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 36px 32px;">
                  <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                    Hi <strong>{{member_name}}</strong>,
                  </p>
                  <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                    Great news! Your membership application for <strong>{{entity_name}}</strong> has been reviewed and officially approved. Your account status is now <span style="background-color: #d1fae5; color: #065f46; font-weight: 600; padding: 2px 8px; border-radius: 4px;">{{approval_status}}</span>.
                  </p>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px; padding: 20px;">
                    <tr>
                      <td>
                        <h3 style="color: #1e293b; margin: 0 0 12px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                          What you can do now:
                        </h3>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 8px; line-height: 1.5;">
                          ✓ Connect and network with active members
                        </p>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 8px; line-height: 1.5;">
                          ✓ Participate in exclusive community discussions and events
                        </p>
                        <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">
                          ✓ Access resources, mentorship programs, and rewards
                        </p>
                      </td>
                    </tr>
                  </table>
                  <div style="text-align: center; margin: 32px 0 24px;">
                    <a href="{{login_url}}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);">
                      Access Your Account →
                    </a>
                  </div>
                  <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; text-align: center; margin: 0;">
                    If you have any questions, simply reply to this email or reach out to our administration team.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 12px; margin: 0;">
                    © {{entity_name}} · All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  }

  // Default: Registration / Welcome Email
  return `
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            <tr>
              <td style="background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                  Welcome to {{entity_name}}! 🚀
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 15px;">
                  Your registration is complete. Let's get started.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 36px 32px;">
                <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                  Hi <strong>{{member_name}}</strong>,
                </p>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                  Thank you for creating an account with <strong>{{entity_name}}</strong>! We are thrilled to welcome you into our community.
                </p>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px; padding: 20px;">
                  <tr>
                    <td>
                      <h3 style="color: #1e293b; margin: 0 0 12px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        Getting Started Checklist:
                      </h3>
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 8px; line-height: 1.5;">
                        1. Complete your member profile & skills
                      </p>
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 8px; line-height: 1.5;">
                        2. Discover and join active channels & groups
                      </p>
                      <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">
                        3. Introduce yourself to the community feed
                      </p>
                    </td>
                  </tr>
                </table>
                <div style="text-align: center; margin: 32px 0 24px;">
                  <a href="{{login_url}}" style="background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; display: inline-block; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);">
                    Go to Your Dashboard →
                  </a>
                </div>
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; text-align: center; margin: 0;">
                  Registered with: <span style="color: #64748b;">{{member_email}}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 12px; margin: 0;">
                  © {{entity_name}} · Powered by Thrico Network
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
