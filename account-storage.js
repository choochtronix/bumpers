(function (root) {
  function createAccountStorage(storage, keys, getOwner) {
    const privateKeys = new Set([keys.profiles, keys.seen, keys.watching, keys.settings,
      keys.cloudSyncMeta, keys.savedSearchDeletionTombstones, keys.savedSearchScans,
      keys.listingLedger, keys.freshFindCache, keys.feedbackRules].filter(Boolean));
    const scope = (key, owner) => `${key}.owner.${encodeURIComponent(owner || "guest")}`;
    const read = (key, fallback) => {
      try { return JSON.parse(storage.getItem(key)) ?? fallback; } catch { return fallback; }
    };
    const storedProfiles = read(keys.profiles, []);
    const profiles = Array.isArray(storedProfiles)
      ? storedProfiles.filter((profile) => profile && typeof profile === "object" && !Array.isArray(profile)) : [];
    const profileOwner = (profile) => typeof profile.userId === "string" && profile.userId && profile.userId !== "local" ? profile.userId : "guest";
    let migration = read("brrtz.accountStorage.v1", null);
    if (!migration) {
      const owners = new Set([...profiles.map((profile) => profile.userId),
        read(keys.authSession, {})?.user?.id, read(keys.cloudSyncMeta, {})?.userId]
        .filter((id) => typeof id === "string" && id && id !== "local"));
      const legacyOwner = owners.size === 1 ? [...owners][0] : owners.size ? "legacy-quarantine" : "guest";
      migration = { aliases: {} };
      for (const key of privateKeys) {
        if (key === keys.profiles) continue;
        if (storage.getItem(key) !== null && storage.getItem(scope(key, legacyOwner)) === null) migration.aliases[key] = legacyOwner;
      }
      // Bind bulky legacy keys to one owner rather than doubling their storage usage.
      try { storage.setItem("brrtz.accountStorage.v1", JSON.stringify(migration)); }
      catch {
        migration = { aliases: {} };
        console.warn("Account storage migration needs free browser storage. Original data is preserved.");
      }
    }
    const resolve = (key) => !privateKeys.has(key) || migration.aliases?.[key] === (getOwner() || "guest")
      ? key : scope(key, getOwner());
    return {
      getItem: (key) => {
        const value = storage.getItem(resolve(key));
        if (key !== keys.profiles || value !== null || migration === true) return value;
        const owned = profiles.filter((profile) => profileOwner(profile) === (getOwner() || "guest"));
        return owned.length ? JSON.stringify(owned) : null;
      },
      setItem: (key, value) => storage.setItem(resolve(key), value),
      removeItem: (key) => key === keys.profiles ? storage.setItem(resolve(key), "[]") : storage.removeItem(resolve(key)),
    };
  }
  root.BrrtzAccountStorage = { createAccountStorage };
})(globalThis);
