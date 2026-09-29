package com.liamrankine.taskmanager.services;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final Resend resend;

    public EmailService(@Value("${RESENDAPI}") String apiKey) {
        this.resend = new Resend(apiKey);
    }

    private void deliverEmail(CreateEmailOptions params) {
        try {
            CreateEmailResponse response = resend.emails().send(params);

            System.out.println("Email sent: " + response.getId());
        } catch (ResendException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendEmail(String to, String subject, String html) {
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Task Manager <onboarding@resend.dev>")
                .to(to)
                .subject(subject)
                .html(html)
                .build();

        deliverEmail(params);
    }

    public void sendWelcomeEmail(String to, String username) {
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Task Manager <onboarding@resend.dev>")
                .to(to)
                .subject("Welcome to The Task Manager!")
                .html("""
                <!DOCTYPE html>
                <html>
                <body>
                    <p>Welcome to The Task Manager %s! </p>
                    
                    <a href="http://localhost:5173/app">
                        Click here to head to the app!
                    </a>
                </body>
                </html>
                """.formatted(username))
                .build();

        deliverEmail(params);
    }

    public void sendInvitationEmail(String to, String groupName, String token) {
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Task Manager <onboarding@resend.dev>")
                .to(to)
                .subject("You've been invited to join %s!".formatted(groupName))
                .html("""
                    <!DOCTYPE html>
                    <html>
                    <body>
                        <p>You've been invited to join %s on Task Manager!</p>
                        
                        <a href="http://localhost:5173/invite/%s">
                            Click here to join!
                        </a>
                    </body>
                    </html>
                """.formatted(groupName, token))
                .build();

        deliverEmail(params);
    }
}
