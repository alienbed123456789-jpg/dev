package Alex.D.dev.config;

import Alex.D.dev.entity.User;
import Alex.D.dev.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setPassword(UUID.randomUUID().toString());
            user.setEnabled(true);
            userRepository.save(user);
        } else if (!user.isEnabled()) {
            user.setEnabled(true);
            userRepository.save(user);
        }

        String targetUrl = "http://localhost:5173/oauth2/redirect?email=" + email;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}