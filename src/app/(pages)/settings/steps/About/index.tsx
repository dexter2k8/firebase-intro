"use client";
import styles from "./styles.module.scss";

export default function About() {
  const { item } = styles;

  return (
    <center className={item}>
      <h3>About</h3>
      <p>
        The purpose of this website is to analyze and monitor data on B3 stocks and funds. Data can
        be entered manually or obtained through Excel reports on the B3 website. If you have any
        questions or suggestions, please send me an email to neimestre@yahoo.com.br with the subject
        &quot;Funds Explorer&quot;.
      </p>
    </center>
  );
}
