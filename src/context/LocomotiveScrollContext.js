import React, {createContext,useContext,} from "react";
import {gsap} from "gsap";
import LocomotiveScroll from "locomotive-scroll";
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as style from "../style/style.module.css";
import {useStateContext} from "./Context";

const LocoScrollContext = createContext()

export const useLocoScrollContext = () => (useContext(LocoScrollContext))

export const LocoScrollProvider = ({children}) => {

    const {scrollContainerRef} = useStateContext()

    let locoScroll = undefined

    gsap.registerPlugin(ScrollTrigger)

    const ScrollInit = (status) => {
        switch (status) {
            case 'init': {
                locoScroll = new LocomotiveScroll({
                        el: scrollContainerRef.current,
                        smooth: true,
                        mobile: {
                            smooth: true
                        },
                        tablet: {
                            smooth: false
                        },
                        smartphone: {
                            smooth: false
                        },
                    }
                )

                locoScroll.on("scroll", ScrollTrigger.update);

                ScrollTrigger.scrollerProxy(scrollContainerRef.current, {
                    scrollTop(value) {
                        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
                    },
                    getBoundingClientRect() {
                        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
                    },
                    pinType: scrollContainerRef.current.style.transform ? "transform" : "fixed"
                });

                ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
                ScrollTrigger.refresh();
            }
                break
            case 'start': {
                locoScroll !== undefined && locoScroll.start()
            }
                break
            case 'stop': {
                locoScroll !== undefined && locoScroll.stop()
            }
                break
            case 'update': {
                locoScroll !== undefined && locoScroll.update()
            }
                break
            case 'reset': {
                locoScroll !== undefined && locoScroll.destroy()
            }
                break
        }
    }

    const scrollTop = () => {
        locoScroll.scrollTo('top')
    }

    return (
        <LocoScrollContext.Provider value={{ScrollInit, ScrollTrigger, scrollTop}}>
            <div className={style.wrapper} data-scroll-container ref={scrollContainerRef}>
                {children}
            </div>
        </LocoScrollContext.Provider>
    )
}

