import { instead } from "@vendetta/patcher";
import { Alert } from "react-native";

let unpatch: (() => void) | undefined;

export function onLoad() {
    const proxy = (globalThis as any).nativeModuleProxy;
    const audioManager = proxy?.AudioManager;

    Alert.alert(
        "AudioFix Debug",
        `Proxy: ${typeof proxy}\n` +
        `AudioManager: ${typeof audioManager}\n` +
        `Method: ${typeof audioManager?.setCommunicationModeOn}`
    );

    if (
        !audioManager ||
        typeof audioManager.setCommunicationModeOn !== "function"
    ) {
        console.warn("[AudioFix] AudioManager method unavailable");
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
    unpatch = undefined;
}