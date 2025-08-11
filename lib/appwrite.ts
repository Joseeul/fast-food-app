import {CreateUserParams, SignInParams} from "@/type";
import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.app.fastfood",
    databaseId: "6898301e003d42e201c7",
    bucketId: "6899a5a6003bac386ae4",
    userCollectionId: "68983053000d387d8b8b",
    categoriesCollectionId: "68999efb0004170d5b7e",
    menuColletionId: "6899a0ae000eab3aa7d0",
    customizationsCollectionId: "6899a2b20023ffe07920",
    menuCustomizationCollectionId: "6899a41b003a9e55ac29",
};

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({
                                     email,
                                     password,
                                     name,
                                 }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);
        if (!newAccount) throw Error;

        await signIn({email, password});

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                email,
                name,
                accountId: newAccount.$id,
                avatar: avatarUrl,
            }
        );
    } catch (error) {
        throw new Error(error as string);
    }
};

export const signIn = async ({email, password}: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (error) {
        throw new Error(error as string);
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        throw new Error(error as string);
    }
};
