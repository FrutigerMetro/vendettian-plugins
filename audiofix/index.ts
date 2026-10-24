import { instead } from "@vendetta/patcher";
import { ReactNative } from "@vendetta/metro/common";

let unpatch: (() => void) | undefined;

export default {
    onLoad() {
        const registry = ReactNative.TurboModuleRegistry;

        if (!registry) {
            console.warn("[AudioFix] TurboModuleRegistry unavailable");
            return;
        }

        const nativeAudio = registry.get("NativeAudioManagerModule");
        const rtnAudio = registry.get("RTNAudioManager");

        console.log("[AudioFix] NativeAudioManagerModule:", !!nativeAudio);
        console.log("[AudioFix] RTNAudioManager:", !!rtnAudio);

        const audioManager = [nativeAudio, rtnAudio].find(
            (module) =>
                module &&
                typeof module.setCommunicationModeOn === "function"
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

        console.log("[AudioFix] Patch installed");
    },

    onUnload() {
        unpatch?.();
        unpatch = undefined;
    },
};