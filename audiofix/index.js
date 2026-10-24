import { instead } from "@vendetta/patcher";

let unpatch: (() => void) | undefined;

export function onLoad() {
    const audioManager = globalThis.nativeModuleProxy?.AudioManager;

    console.log("[AudioFix] AudioManager:", audioManager);
    console.log(
        "[AudioFix] setCommunicationModeOn:",
        typeof audioManager?.setCommunicationModeOn
    );

    if (typeof audioManager?.setCommunicationModeOn !== "function") {
        console.warn("[AudioFix] Native audio method unavailable");
        return;
    }

    unpatch = instead(
        "setCommunicationModeOn",
        audioManager,
        () => {}
    );
}

export function onUnload() {
    unpatch?.();
}