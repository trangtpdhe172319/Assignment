import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import styles from "./ForgotPassword.module.scss";
import Swal from "sweetalert2";

function useOutsideAlerter(ref, hide) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        hide(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, hide]);
}

function ForgotPassword({ setGoLogin, setForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const forgotPasswordRef = useRef();

  useOutsideAlerter(forgotPasswordRef, setGoLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Email is required",
        text: "Please provide an email address.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (!password) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Password is required",
        text: "Please provide a new password.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Passwords do not match",
        text: "Please ensure the passwords match.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      console.log("Email:", email);
      console.log("Password:", password);
      // Tìm người dùng và cập nhật mật khẩu
      const response = await axios.get("http://localhost:9000/account?email=" + email);
      if (response.data.length === 0) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "User not found",
          text: "No account found with this email.",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        const user = response.data[0];
        await axios.patch("http://localhost:9000/account/" + user.id, { password: password });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Password has been reset",
          text: "You can now log in with your new password.",
          showConfirmButton: false,
          timer: 1500,
        });
        setForgotPassword(false);
        setGoLogin(false);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className={styles.bgc}>
      <div ref={forgotPasswordRef} className={styles.loginBox}>
        <div onClick={() => setGoLogin(false)} className={styles.cancel}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <h3>Forgot your password?</h3>
        <p>Enter your email and new password to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <div className={clsx(styles.searchBox)}>
            <p>Email Address</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="text"
              required
            />
          </div>
          <div className={clsx(styles.searchBox)}>
            <p>New Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              required
            />
          </div>
          <div className={clsx(styles.searchBox)}>
            <p>Confirm New Password</p>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirmPassword"
              type="password"
              required
            />
          </div>
          <button type="submit" className={clsx(styles.signIn)}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
