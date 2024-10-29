import { registerEventWithObject, unregisterEventWithObject } from "../event_handler.js";
import Animator from "../Animator.js";
export class AdmobAdsProvider {
    runtime;
    settings;
    interstitialId;
    rewardedId;
    rewardedCallback;
    constructor(runtime, settings) {
        this.runtime = runtime;
        this.settings = settings;
        this.interstitialId = settings.interstitial;
        this.rewardedId = settings.rewarded;
        if (this.isConfigured())
            this.onConfigured();
        else
            registerEventWithObject(runtime, this, "ADMOB_CONFIGURATION_COMPLETE", this.onConfigured.bind(this));
    }
    get id() {
        return "ADMOB";
    }
    get isInterstitialAvailable() {
        return this.runtime.callFunction("IsInterstitialLoadedInternal") === 1;
    }
    get isRewardedAvailable() {
        return this.runtime.callFunction("IsRewardedLoadedInternal") === 1;
    }
    showInterstitial() {
        this.runtime.callFunction("ShowInterstitialInternal");
        const animator = Animator.create(this.runtime, true);
        animator.delay(3).asPromise(animator).then(() => {
            this.loadInterstitial();
            animator.destroy();
        });
        this.loadInterstitial();
    }
    async showRewarded() {
        this.runtime.callFunction("ShowRewardedInternal");
        unregisterEventWithObject(this.runtime, this, "REWARDED_RESULT");
        return new Promise(resolve => {
            registerEventWithObject(this.runtime, this, "REWARDED_RESULT", (data) => {
                unregisterEventWithObject(this.runtime, this, "REWARDED_RESULT");
                resolve(data > 0);
                const animator = Animator.create(this.runtime, true);
                animator.delay(3).asPromise(animator).then(() => {
                    this.loadRewarded();
                    animator.destroy();
                });
            });
        });
    }
    loadInterstitial() {
        this.runtime.callFunction("LoadInterstitialInternal", this.interstitialId);
    }
    loadRewarded() {
        this.runtime.callFunction("LoadRewardedInternal", this.rewardedId);
    }
    isConfigured() {
        return this.runtime.callFunction("IsAdmobConfiguredInternal") === 1;
    }
    onRewardedResult(result) {
        console.log("Rewarded result:" + result);
        if (this.rewardedCallback)
            this.rewardedCallback(result);
    }
    onConfigured() {
        console.log("Admob configured");
        unregisterEventWithObject(this.runtime, this, "ADMOB_CONFIGURATION_COMPLETE");
        this.loadInterstitial();
        this.loadRewarded();
    }
    dispose() {
        unregisterEventWithObject(this.runtime, this, "REWARDED_RESULT");
    }
}
