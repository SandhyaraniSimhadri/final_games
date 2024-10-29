import { prefs } from "../Main.js";
import { loadJsonFileFromPath } from "../FileUtils.js";
import { AdmobAdsProvider } from "./admob_ads_provider.js";
import { rand } from "../Utils.js";
export default class AdsManager {
    runtime;
    providersSettings = new Map();
    settings;
    constructor(runtime) {
        this.runtime = runtime;
    }
    static _instance;
    static get instance() {
        if (!this._instance) {
            this._instance = new AdsManager(window.gRuntime);
        }
        return this._instance;
    }
    get adsPassLeftCount() {
        if (!prefs.hasItem("adsPassLeftCount")) {
            this.setForNextAds();
        }
        return prefs.getItem("adsPassLeftCount", 0);
    }
    set adsPassLeftCount(value) {
        prefs.setItem("adsPassLeftCount", value);
    }
    get isPremium() {
        return prefs.getItem("isPremium", false);
    }
    _initialized = false;
    get initialized() {
        return this._initialized;
    }
    set initialized(value) {
        this._initialized = value;
    }
    get enable() {
        return !this.isPremium;
    }
    get isAndroid() {
        return this.runtime.callFunction("IsAndroid") === 1;
    }
    get isIOS() {
        return this.runtime.callFunction("IsiOS") === 1;
    }
    get isMobile() {
        return this.runtime.callFunction("IsMobileBuild") === 1;
    }
    async init() {
        if (this.initialized)
            return;
        this.settings = await this.loadSettings();
        if (!this.settings)
            return;
        this.initialized = true;
        if (!this.isMobile)
            return;
        const admobSetting = this.isAndroid ? this.settings["admob"]["android"] : this.settings["admob"]["ios"];
        const adsProvider = new AdmobAdsProvider(this.runtime, admobSetting);
        this.providersSettings.set(adsProvider, admobSetting);
    }
    isInterstitialAvailable(providerId) {
        const providersSettings = AdsManager.instance.providersSettings;
        return [...providersSettings.keys()]
            .filter(provider => (!providerId || providerId === provider.id))
            .some(provider => provider.isInterstitialAvailable);
    }
    isRewardedAvailable(providerId) {
        const providersSettings = AdsManager.instance.providersSettings;
        return [...providersSettings.keys()]
            .filter(provider => (!providerId || providerId === provider.id))
            .some(provider => provider.isRewardedAvailable);
    }
    passInterstitialIfCan() {
        if (!this.enable) {
            return;
        }
        this.adsPassLeftCount = Math.max(0, this.adsPassLeftCount - 1);
    }
    showInterstitial(providerId) {
        const providersSettings = AdsManager.instance.providersSettings;
        const providers = [...providersSettings.keys()]
            .filter(provider => (!providerId || providerId === provider.id)
            && provider.isInterstitialAvailable && providersSettings.get(provider).interstitialPriority > 0);
        if (providers.length === 0)
            return;
        providers.randomWithProbability(provider => providersSettings.get(provider).interstitialPriority)
            .showInterstitial();
    }
    showOrPassInterstitialIfCan() {
        if (!this.enable) {
            return false;
        }
        this.passInterstitialIfCan();
        if (this.adsPassLeftCount <= 0 && this.isInterstitialAvailable()) {
            this.showAdsIfPassedIfCan();
            return true;
        }
        return false;
    }
    showAdsIfPassedIfCan() {
        if (!this.enable || this.adsPassLeftCount > 0 || !this.isInterstitialAvailable()) {
            return;
        }
        this.showInterstitial();
        this.setForNextAds();
    }
    async showRewarded(providerId) {
        const providersSettings = AdsManager.instance.providersSettings;
        const providers = [...providersSettings.keys()]
            .filter(provider => (!providerId || providerId === provider.id)
            && provider.isRewardedAvailable && providersSettings.get(provider).rewardedPriority > 0);
        if (providers.length === 0) {
            return false;
        }
        return providers.randomWithProbability(provider => providersSettings.get(provider).rewardedPriority)
            .showRewarded();
    }
    async loadSettings() {
        try {
            return await loadJsonFileFromPath(this.runtime, "adsSettings.json");
        }
        catch (e) {
        }
    }
    setForNextAds() {
        this.adsPassLeftCount = rand(this.settings["minAndMaxPasses"].min, this.settings["minAndMaxPasses"].max + 1);
    }
}
