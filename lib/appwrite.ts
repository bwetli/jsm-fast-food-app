import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import {CreateUserParams, GetMenuParams, SignInParams} from "@/type";


export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.jsm.fastfood",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: "68fbae0d002ddd033a5d",
    bucketId: "68fe9e40002c6037c5eb",
    userCollection: "68fbf1a70023277a9778",
    categoriesCollection: "categories",
    menuCollection: "menu",
    customizationsCollection: "customizations",
    menuCustomizationsCollection: "menu_Customizations",

}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint!)
    .setProject(appwriteConfig.projectId!)
    .setPlatform(appwriteConfig.platform!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

const avatars = new Avatars(client);

export const createUser = async ({email, password, name}: CreateUserParams ) => {
    try {
        const newAccount = await account.create(ID.unique(),email, password, name);

        if(!newAccount) throw Error;

        await signIn({email, password});

        const avatarUrl = await avatars.getInitialsURL(name);

        return await databases.createDocument(appwriteConfig.databaseId!, appwriteConfig.userCollection, ID.unique(), {
            accountId: newAccount.$id,
            email,
            name,
            avatarURL: avatarUrl,
        });

    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password}: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollection,
            [Query.equal("accountId", currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({ category, query}: GetMenuParams) => {
    try {
        const queries: string[] = [];
        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollection,
            queries,
        )

        return menus.documents;


    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollection,
        )
    } catch (e) {
        throw new Error(e as string);
    }
}