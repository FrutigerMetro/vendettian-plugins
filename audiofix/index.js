import { instead } from "@vendetta/patcher";
import { ReactNative } from "@vendetta/metro/common";

let unpatch: (() => void) | undefined;

export function onLoad() {
    const registry = ReactNative.TurboModuleRegistry;

    const nativeAudio = registry.get("NativeAudioManagerModule");
    const rtnAudio = registry.get("RTNAudioManager");

    console.log("[AudioFix] NativeAudioManagerModule:", !!nativeAudio);
    console.log("[AudioFix] RTNAudioManager:", !!rtnAudio);

    const audioManager = [nativeAudio, rtnAudio].find(
        (module) => typeof module?.setCommunicationModeOn === "function"
    );

    if (!audioManager) {
        console.warn("[AudioFix] No compatible audio manager found");
        return;
    }

    unpatch = instead(
        "setCommunicationModeOn",
        audioManager,
        () => {
            console.log("[AudioFix] Blocked communication mode");
        }
    );

    console.log("[AudioFix] Patch installed successfully");
}

export function onUnload() {
    unpatch?.();
    unpatch = undefined;
}