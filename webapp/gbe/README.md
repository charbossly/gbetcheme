npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev

Ouvrez http://localhost:3000 dans votre navigateur pour voir le résultat.

Vous pouvez commencer à modifier la page en modifiant app/page.tsx. La page se met à jour automatiquement lorsque vous modifiez le fichier.

Ce projet Next js doit pour être effectivement exploiter être lancé en parallèle avec son application backend en python lui est associé et qui contient tous les endpoints necessaires. Les variables d'environnement réellement necessaire sont : FILE_SERVER,
API_SERVER, OPENAI_API_KEY.

Après le lancement, un serveur doit être lancé en parallèle pour stocker les ressources(vidéos et audio à utiliser) afin de permettre un accès aux api en du projet back. Ainsi les variables d'environnement FILE_SERVER et API_SERVER représentent respectivement l'adresse ip suivie du port de la machine de lancement sur le serveur (ex: http://10.229.32.211:5433) et API_SERVER l'adresse suivie du port de la machine de lancement du projet back sur le serveur (ex: http://10.229.32.172:8080). Vous devez donc ajouter toutes les ressources à uploader dans l'application dans un dossier public ouvert sur le serveur avant tout
Ex: Pour celà procédez comme suit : npm install -g serve;   cd chemin/vers/votre/repertoire;  serve






















## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
