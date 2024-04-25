const Login = () => {
  return (
    <div className="login-form">
      <form>
        <label for="name"> Nom complet </label>{" "}
        <input type="text" name="name" />
        <label for="password"> Mot de passe </label>{" "}
        <input type="password" name="password" />
      </form>{" "}
    </div>
  );
};

export default Login;
