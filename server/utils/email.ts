import { render } from '@vue-email/render'
import Invitation from '~/emails/Invitation.vue'

export async function sendInvitationEmail(email: string, url: string) {
  const { resend } = useAppConfig()
  const { emails } = useResend()

  const subject = 'Invitation à rejoindre Nina Face B'

  const text = await render(Invitation, { url }, { plainText: true })
  const html = await render(Invitation, { url }, { pretty: true })

  const emailData = {
    from: resend.from,
    to: email,
    subject,
    text,
    html,
  }

  try {
    await emails.send(emailData)
  } catch (error) {
    console.error('Error sending invitation email:', error)
    throw createError({ message: 'Failed to send invitation email', statusCode: 500 })
  }
}
