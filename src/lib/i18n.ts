/**
 * SEMPela - Internationalization
 * Supports English (EN) and French (FR)
 * Author: Josué Sempela
 */

export type Language = 'en' | 'fr';

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    explore: 'Explore',
    upload: 'Upload',
    admin: 'Admin',
    profile: 'Profile',

    // Video Feed
    loading: 'Loading videos...',
    noVideos: 'No videos yet',
    noVideosDesc: 'Be the first to upload a video!',
    pullToRefresh: 'Pull to refresh',
    swipeToExplore: 'Swipe up to explore',

    // Video Actions
    like: 'Like',
    liked: 'Liked',
    share: 'Share',
    views: 'Views',
    comment: 'Comment',
    save: 'Save',
    report: 'Report',

    // Share
    shareVideo: 'Share Video',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied!',
    shareViaWhatsApp: 'Share via WhatsApp',
    shareViaTwitter: 'Share via Twitter',

    // Upload
    uploadVideo: 'Upload Video',
    videoTitle: 'Video Title',
    videoDescription: 'Description',
    videoTags: 'Tags (comma separated)',
    selectVideo: 'Select Video',
    dragDropVideo: 'Drag & drop your video here',
    orBrowse: 'or click to browse',
    uploading: 'Uploading...',
    uploadSuccess: 'Video uploaded successfully!',
    uploadError: 'Upload failed. Please try again.',
    maxFileSize: 'Max file size: 100MB',
    supportedFormats: 'Supported: MP4, MOV, AVI',

    // Admin
    adminDashboard: 'Admin Dashboard',
    totalVideos: 'Total Videos',
    totalViews: 'Total Views',
    totalLikes: 'Total Likes',
    deleteVideo: 'Delete Video',
    deleteConfirm: 'Are you sure you want to delete this video?',
    deleteSuccess: 'Video deleted successfully',
    videoManager: 'Video Manager',
    addNewVideo: 'Add New Video',
    enterPassword: 'Enter admin password',
    wrongPassword: 'Incorrect password',
    login: 'Login',
    logout: 'Logout',

    // Errors
    errorLoading: 'Failed to load videos',
    tryAgain: 'Try Again',
    networkError: 'Network error. Please check your connection.',

    // Footer
    footerText: 'SEMPela — Developed by Josué Sempela',
    footerContact: 'WhatsApp: +243975111541',

    // Misc
    trending: 'Trending',
    new: 'New',
    following: 'Following',
    forYou: 'For You',
    mute: 'Mute',
    unmute: 'Unmute',
    play: 'Play',
    pause: 'Pause',
    fullscreen: 'Fullscreen',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save_btn: 'Save',
    submit: 'Submit',
    search: 'Search',
    searchPlaceholder: 'Search videos, users...',
    noResults: 'No results found',
  },

  fr: {
    // Navigation
    home: 'Accueil',
    explore: 'Explorer',
    upload: 'Publier',
    admin: 'Admin',
    profile: 'Profil',

    // Video Feed
    loading: 'Chargement des vidéos...',
    noVideos: 'Aucune vidéo pour le moment',
    noVideosDesc: 'Soyez le premier à publier une vidéo !',
    pullToRefresh: 'Tirer pour actualiser',
    swipeToExplore: 'Glisser vers le haut pour explorer',

    // Video Actions
    like: 'J\'aime',
    liked: 'Aimé',
    share: 'Partager',
    views: 'Vues',
    comment: 'Commenter',
    save: 'Enregistrer',
    report: 'Signaler',

    // Share
    shareVideo: 'Partager la vidéo',
    copyLink: 'Copier le lien',
    linkCopied: 'Lien copié !',
    shareViaWhatsApp: 'Partager via WhatsApp',
    shareViaTwitter: 'Partager via Twitter',

    // Upload
    uploadVideo: 'Publier une vidéo',
    videoTitle: 'Titre de la vidéo',
    videoDescription: 'Description',
    videoTags: 'Tags (séparés par des virgules)',
    selectVideo: 'Sélectionner une vidéo',
    dragDropVideo: 'Glissez-déposez votre vidéo ici',
    orBrowse: 'ou cliquez pour parcourir',
    uploading: 'Téléchargement...',
    uploadSuccess: 'Vidéo publiée avec succès !',
    uploadError: 'Échec du téléchargement. Veuillez réessayer.',
    maxFileSize: 'Taille max : 100 Mo',
    supportedFormats: 'Formats supportés : MP4, MOV, AVI',

    // Admin
    adminDashboard: 'Tableau de bord Admin',
    totalVideos: 'Total Vidéos',
    totalViews: 'Total Vues',
    totalLikes: 'Total J\'aimes',
    deleteVideo: 'Supprimer',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette vidéo ?',
    deleteSuccess: 'Vidéo supprimée avec succès',
    videoManager: 'Gestion des vidéos',
    addNewVideo: 'Ajouter une vidéo',
    enterPassword: 'Entrez le mot de passe admin',
    wrongPassword: 'Mot de passe incorrect',
    login: 'Connexion',
    logout: 'Déconnexion',

    // Errors
    errorLoading: 'Impossible de charger les vidéos',
    tryAgain: 'Réessayer',
    networkError: 'Erreur réseau. Vérifiez votre connexion.',

    // Footer
    footerText: 'SEMPela — Développé par Josué Sempela',
    footerContact: 'WhatsApp : +243975111541',

    // Misc
    trending: 'Tendances',
    new: 'Nouveau',
    following: 'Abonnements',
    forYou: 'Pour toi',
    mute: 'Muet',
    unmute: 'Activer le son',
    play: 'Lire',
    pause: 'Pause',
    fullscreen: 'Plein écran',
    close: 'Fermer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save_btn: 'Enregistrer',
    submit: 'Soumettre',
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher des vidéos, des utilisateurs...',
    noResults: 'Aucun résultat trouvé',
  },
};

export type TranslationKey = keyof typeof translations.en;

export function useTranslation(lang: Language) {
  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key] || key;
  };
  return { t };
}
