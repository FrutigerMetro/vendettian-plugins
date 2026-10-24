(function () {
    "use strict";

    const registry = vendetta.metro.common.ReactNative.TurboModuleRegistry;

    const nativeAudio = registry.get("NativeAudioManagerModule");
    const rtnAudio = registry.get("RTNAudioManager");

    console.log("[AudioFix] NativeAudioManagerModule:", !!nativeAudio);
    console.log("[AudioFix] RTNAudioManager:", !!rtnAudio);

    const audioManager = [nativeAudio, rtnAudio].find(
        module => typeof module?.setCommunicationModeOn === "function"
    );

    if (!audioManager) {
        console.warn("[AudioFix] No compatible audio manager found");
        return {};
    }

    const unpatch = vendetta.patcher.instead(
        "setCommunicationModeOn",
        audioManager,
        () => {
            console.log("[AudioFix] Blocked communication mode");
        }
    );

    console.log("[AudioFix] Patch installed");

    return { onUnload: unpatch };
})();