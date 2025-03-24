import React from 'react'
import '../styles/LoaderStyle.css'

const Loader = () => {
    return (
        <div class="loader">
            <svg class="absolute" width="0" height="0">
                <defs>
                    <linearGradient
                        id="b"
                        x1="0"
                        y1="62"
                        x2="0"
                        y2="2"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stop-color="#973BED"></stop>
                        <stop offset="1" stop-color="#007CFF"></stop>
                    </linearGradient>
                    <linearGradient
                        id="c"
                        x1="0"
                        y1="64"
                        x2="0"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stop-color="#FFC800"></stop>
                        <stop offset="1" stop-color="#F0F"></stop>
                        <animateTransform
                            attributeName="gradientTransform"
                            type="rotate"
                            values="0 32 32;-270 32 32;-540 32 32;-810 32 32;-1080 32 32"
                            dur="8s"
                            keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1"
                            repeatCount="indefinite"
                        ></animateTransform>
                    </linearGradient>
                    <linearGradient
                        id="d"
                        x1="0"
                        y1="62"
                        x2="0"
                        y2="2"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stop-color="#00E0ED"></stop>
                        <stop offset="1" stop-color="#00DA72"></stop>
                    </linearGradient>
                </defs>
            </svg>

            <svg viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    pathLength="360"
                    d="M3 3L3 37L11 37L11 23L18 37L27 37L17 20L28 3L19 3L11 17L11 3Z
    "
                    class="dash gradient-b"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
            </svg>

            <svg viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    pathLength="360"
                    d="M15.75 11.40Q13.60 11.40 12.58 12.65Q11.55 13.90 11.55 17.10L11.55 23L19.85 23L19.85 17Q19.85 14.90 19.35 13.63Q18.85 12.35 17.98 11.88Q17.10 11.40 15.75 11.40M19.85 29.90L11.55 29.90L11.55 32.55Q11.55 35.10 10.20 36.30Q8.85 37.50 5.55 37.50Q4.15 37.50 3.25 37.10Q2.35 36.70 1.68 35.75Q1.00 34.80 0.68 32.98Q0.35 31.15 0.18 28.57Q0 26 0 22.05Q0 18.60 0.73 15.72Q1.45 12.85 2.68 10.85Q3.90 8.85 5.45 7.32Q7 5.80 8.83 4.95Q10.65 4.10 12.38 3.67Q14.10 3.25 15.85 3.25Q17.95 3.25 20.00 3.82Q22.05 4.40 24.15 5.80Q26.25 7.20 27.83 9.27Q29.40 11.35 30.40 14.65Q31.40 17.95 31.40 22.05Q31.40 28.65 30.93 31.82Q30.45 35 29.33 36.25Q28.20 37.50 25.85 37.50Q22.55 37.50 21.20 36.30Q19.85 35.10 19.85 32.55L19.85 29.90Z"
                    class="dash gradient-c"
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
            </svg>

            <svg viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    pathLength="360"
                    d="M0 37.50L0 3.30L10.20 3.30L15.40 26.80L20.60 3.30L30.80 3.30L30.80 37.50L22.20 37.50L22.20 13.50L16.80 37.50L13.90 37.50L8.50 13.50L8.50 37.50Z
    "
                    class="dash gradient-d"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
            </svg>

            <svg viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    pathLength="360"
                    d="M15.75 11.40Q13.60 11.40 12.58 12.65Q11.55 13.90 11.55 17.10L11.55 23L19.85 23L19.85 17Q19.85 14.90 19.35 13.63Q18.85 12.35 17.98 11.88Q17.10 11.40 15.75 11.40M19.85 29.90L11.55 29.90L11.55 32.55Q11.55 35.10 10.20 36.30Q8.85 37.50 5.55 37.50Q4.15 37.50 3.25 37.10Q2.35 36.70 1.68 35.75Q1.00 34.80 0.68 32.98Q0.35 31.15 0.18 28.57Q0 26 0 22.05Q0 18.60 0.73 15.72Q1.45 12.85 2.68 10.85Q3.90 8.85 5.45 7.32Q7 5.80 8.83 4.95Q10.65 4.10 12.38 3.67Q14.10 3.25 15.85 3.25Q17.95 3.25 20.00 3.82Q22.05 4.40 24.15 5.80Q26.25 7.20 27.83 9.27Q29.40 11.35 30.40 14.65Q31.40 17.95 31.40 22.05Q31.40 28.65 30.93 31.82Q30.45 35 29.33 36.25Q28.20 37.50 25.85 37.50Q22.55 37.50 21.20 36.30Q19.85 35.10 19.85 32.55L19.85 29.90Z"
                    class="dash gradient-b"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
            </svg>
            <div class="w-2"></div>
        </div>
    )
}

export default Loader