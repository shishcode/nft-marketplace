import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import { startAnimation } from '../util/jsAnimation';

/**
 * Landing page with a simple gradient background and a hero asset.
 * Free to customize as you see fit.
 */
const Home: NextPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      // pass the reference to your canvas element to the startAnimation function
      startAnimation(canvas);
    }
  }, []); // this effect will run once after the first render

  return (
    <>
      <canvas ref={canvasRef} id="c"></canvas>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.hero}>
            <div className={styles.heroBackground}>
              <div className={styles.heroBackgroundInner}>
                <Image
                  src="/hero-gradient.png"
                  width={1390}
                  height={1390}
                  alt="Background gradient from red to blue"
                  quality={100}
                  className={styles.gradient}
                />
              </div>
            </div>
            <div className={styles.heroAssetFrame}>
              <Image
                src="/snakes.jpg"
                width={150}
                height={150}
                style={{ marginTop:"50px", borderRadius: "50%" }}
                alt="Hero asset, NFT marketplace"
                quality={100}
                className={styles.heroAsset}
              />
            </div>
            <div className={styles.heroBodyContainer}>
              <div className={styles.heroBody}>
                <h1 className={styles.heroTitle}>
                  <span className={styles.heroTitleGradient}>
                    Save the snakes
                  </span>
                  <br />
                  save the world!
                </h1>
                <p className={styles.heroSubtitle}>
                  <Link
                    className={styles.link}
                    href="https://thirdweb.com"
                    target="_blank"
                  >
                    99% of all snakes are gone
                  </Link>{" "}
                  participate in the initiative of saving life.<br/> <b>Buy an NFT</b>, <i>save the snakes!</i>
                </p>

                <div className={styles.heroCtaContainer}>
                  <Link className={styles.heroCta} href="/buy">
                    Get Started
                  </Link>
                  <Link
                    className={styles.secondaryCta}
                    href="https://github.com/thirdweb-example/marketplace-v3"
                    target="_blank"
                  >
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
