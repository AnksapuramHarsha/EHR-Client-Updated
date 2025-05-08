import RegisterForm from "../components/SignInOrSignUp/RegisterForm"
import RegisterImage from "../images/register_img.jpg"

const RegisterPage = () => {
    return (
        <div
            className="relative min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${RegisterImage})` }}
        >
            {/* Overlay with blur */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-0" />

            {/* Centered Form */}
            <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
                <RegisterForm />
            </div>
        </div>
    )
}

export default RegisterPage
