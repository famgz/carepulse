'use server';

import { users } from '@/lib/appwrite.config';
import { parseStringify } from '@/lib/utils';
import { ID, Query } from 'node-appwrite';

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    console.log(newUser);
    return newUser;
  } catch (err: any) {
    if (err && err?.code === 409) {
      const documents = await users.list([Query.equal('email', [user.email])]);
      return documents?.users[0];
    }
  }
};
