export function setLocaleCookie(locale: string): void {
	document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 30}`; // Cookie valide pour 30 jours
}
