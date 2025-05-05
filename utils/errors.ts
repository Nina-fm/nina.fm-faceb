interface ErrorData {
  statusMessage: string
  message: string
  redirect: string
  buttonText: string
}

export const errors: Record<number, ErrorData> = {
  401: {
    statusMessage: 'Authentification requise',
    message: 'Vous devez vous connecter pour accéder à cette page.',
    redirect: '/login',
    buttonText: 'Se connecter',
  },
  403: {
    statusMessage: 'Page non autorisée',
    message: "Vous n'avez pas les permission requises pour accéder à cette page. Veuillez contacter un administrateur.",
    redirect: '/',
    buttonText: "Retrourner à l'accueil",
  },
  404: {
    statusMessage: 'Page inexistante',
    message: "La page que vous recherchez n'existe pas ou a été supprimée.",
    redirect: '/',
    buttonText: "Retrourner à l'accueil",
  },
  500: {
    statusMessage: 'Erreur interne du serveur',
    message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    redirect: '/',
    buttonText: "Retour à l'accueil",
  },
}
