import LoginForm from "../components/SignInOrSignUp/LoginForm"
import RegisterImage from "../images/register_img.jpg"

const LoginPage = () => {
    return (
        <div className="relative min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${RegisterImage})` }}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-0" />
            <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage
