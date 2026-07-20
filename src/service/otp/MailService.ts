import { Resend } from "resend";


export class MailService {
    private resend = new Resend(process.env.RESEND_API_KEY);

    async sendOtpMail(email: string, code: string): Promise<void> {
        const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>[TESTUS] 테스터스 인증번호</title>
</head>

<body style="margin:0;padding:0;background-color:#f5f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f6f8;padding:20px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:10px;padding:30px;">

<tr>
<td style="font-size:22px;font-weight:bold;padding-bottom:20px;">
[TESTUS] 테스터스 인증번호
</td>
</tr>

<tr>
<td>
<hr style="border:none;border-top:1px solid #eeeeee;margin:20px 0;">
</td>
</tr>

<tr>
<td style="font-size:16px;padding-bottom:10px;">
인증번호 :
<span style="font-size:24px;font-weight:bold;color:#2b6cff;">
${code}
</span>
</td>
</tr>

<tr>
<td style="font-size:14px;color:#666666;padding-bottom:20px;">
이 인증번호는 <strong>3분 동안</strong> 유효합니다.
</td>
</tr>

<tr>
<td style="font-size:14px;color:#666666;padding-bottom:20px;">
인증번호에 문제가 있을 경우, 담당자에 문의 주시면 빠르게 도움 드리겠습니다.
</td>
</tr>

<tr>
<td>
<hr style="border:none;border-top:1px solid #eeeeee;margin:20px 0;">
</td>
</tr>

<tr>
<td style="font-size:12px;color:#999999;padding-bottom:10px;">
본 메일은 발신 전용으로 회신되지 않습니다.
</td>
</tr>

<tr>
<td style="font-size:13px;color:#333333;font-weight:bold;">
DevOn Studio
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`
        console.log('[Resend] email send start');
        const {data, error} = await this.resend.emails.send({
            from: 'no-reply@testusserver.xyz',
            to: email,
            subject: 'TESTUS 인증번호',
            html: htmlContent
        });
        if(error) {
            return console.log('[Resend] email send error : ', error);
        }
        if(data) {
            return console.log(`[Resend] email send success :  ${data} / ${code}`);
        }
    }
}