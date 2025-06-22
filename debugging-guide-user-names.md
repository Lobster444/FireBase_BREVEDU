# Step-by-Step Debugging Guide: User Names Not Saving During Registration

## Overview
This guide will help you systematically debug why user names are not being saved to Firebase or displayed in the frontend during user registration.

## Step 1: Verify the User Registration Form

### 1.1 Check Form State Management
Look at `src/components/AuthModal.tsx` lines 50-60:

```typescript
// Verify these state variables exist and are properly managed
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```

**Debug Actions:**
- Add console.log in the form submission to verify name is captured:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('Form submission data:', { name, email, password }); // Add this line
  // ... rest of the function
};
```

### 1.2 Verify Form Input Connection
Check that the name input field is properly connected (around line 180 in AuthModal.tsx):

```typescript
<InputField
  id="name"
  type="text"
  value={name}
  onChange={setName}  // Ensure this is setName, not a different function
  placeholder="Enter your full name"
  required
  minLength={2}
  icon={<User className="h-5 w-5" />}
  label="Full Name"
  autoCapitalize="words"
/>
```

**Debug Actions:**
- Add onChange logging:
```typescript
onChange={(value) => {
  console.log('Name field changed:', value);
  setName(value);
}}
```

## Step 2: Inspect the Firebase Authentication Call

### 2.1 Check Registration Function in AuthContext
Look at `src/contexts/AuthContext.tsx` around line 60:

```typescript
const register = async (email: string, password: string, name: string) => {
  console.log('Register function called with:', { email, password, name }); // Add this
  
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // CRITICAL: Verify this updateProfile call exists and works
  await updateProfile(result.user, {
    displayName: name
  });
  
  // CRITICAL: Verify createUserDocument is called with the name
  await createUserDocument(result.user, name);
  
  return result;
};
```

**Debug Actions:**
- Add try-catch with detailed logging:
```typescript
const register = async (email: string, password: string, name: string) => {
  try {
    console.log('Starting registration for:', { email, name });
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Firebase user created:', result.user.uid);
    
    await updateProfile(result.user, { displayName: name });
    console.log('Profile updated with name:', name);
    
    await createUserDocument(result.user, name);
    console.log('User document created');
    
    return result;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
```

### 2.2 Verify createUserDocument Function
Check the `createUserDocument` function around line 30 in AuthContext.tsx:

```typescript
const createUserDocument = async (firebaseUser: FirebaseUser, name?: string, role: UserRole = 'free') => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      name: name || firebaseUser.displayName || 'User', // CRITICAL: Check this line
      role,
      isAdmin: false,
      aiChatsUsed: 0,
      lastChatReset: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    console.log('Creating user document with data:', userData); // Add this
    await setDoc(userRef, userData);
    return userData;
  }

  return userSnap.data() as User;
};
```

## Step 3: Review Database Operations

### 3.1 Check Firestore Security Rules
Verify your Firestore security rules allow writing user data:

```javascript
// In Firebase Console > Firestore Database > Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to create and read their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3.2 Verify Database Write Operation
Add logging to confirm the write operation:

```typescript
// In createUserDocument function
try {
  await setDoc(userRef, userData);
  console.log('✅ User document written to Firestore successfully');
  
  // Verify the write by reading it back
  const verifySnap = await getDoc(userRef);
  if (verifySnap.exists()) {
    console.log('✅ User document verified in Firestore:', verifySnap.data());
  } else {
    console.error('❌ User document not found after write');
  }
} catch (error) {
  console.error('❌ Error writing user document:', error);
  throw error;
}
```

### 3.3 Check Firebase Console
1. Go to Firebase Console > Firestore Database
2. Navigate to the `users` collection
3. Look for documents with the user's UID
4. Verify the `name` field exists and has the correct value

## Step 4: Debug Frontend Display

### 4.1 Check User State in AuthContext
Verify the user state is properly set after registration:

```typescript
// In AuthContext, check the onAuthStateChanged listener
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('Auth state changed:', firebaseUser?.uid); // Add this
    setFirebaseUser(firebaseUser);
    
    if (firebaseUser) {
      try {
        const userData = await createUserDocument(firebaseUser);
        console.log('Setting current user:', userData); // Add this
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    
    setLoading(false);
  });

  return unsubscribe;
}, []);
```

### 4.2 Check Component Rendering
Look at `src/components/Header.tsx` around line 100 where the user name is displayed:

```typescript
// In the user menu section
<p className="text-base font-semibold text-gray-900">{currentUser.name}</p>
```

**Debug Actions:**
- Add logging to see what's being rendered:
```typescript
console.log('Rendering user name:', currentUser?.name);
<p className="text-base font-semibold text-gray-900">
  {currentUser?.name || 'No name available'}
</p>
```

### 4.3 Check User Object Structure
Add debugging to see the complete user object:

```typescript
// In any component using currentUser
useEffect(() => {
  if (currentUser) {
    console.log('Current user object:', currentUser);
    console.log('User name specifically:', currentUser.name);
    console.log('User display name:', currentUser.displayName); // If this exists
  }
}, [currentUser]);
```

## Step 5: Common Issues and Solutions

### Issue 1: Name Not Passed to Registration Function
**Problem:** The name parameter is not being passed from the form to the register function.

**Solution:** Check the handleSubmit function in AuthModal.tsx:
```typescript
if (mode === 'register') {
  await register(email.trim(), password, name.trim()); // Ensure name.trim() is included
}
```

### Issue 2: Firebase Profile Update Failing
**Problem:** The updateProfile call is failing silently.

**Solution:** Add proper error handling:
```typescript
try {
  await updateProfile(result.user, { displayName: name });
} catch (profileError) {
  console.error('Failed to update Firebase profile:', profileError);
  // Continue with user document creation even if profile update fails
}
```

### Issue 3: Firestore Document Creation Failing
**Problem:** The user document is not being created in Firestore.

**Solution:** Check Firebase configuration and security rules, add retry logic:
```typescript
const createUserDocumentWithRetry = async (firebaseUser, name, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await createUserDocument(firebaseUser, name);
      return;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }
  }
};
```

### Issue 4: User State Not Updating After Registration
**Problem:** The currentUser state doesn't reflect the new user data.

**Solution:** Force a refresh of user data after registration:
```typescript
// In AuthContext register function, after successful registration
const userData = await createUserDocument(result.user, name);
setCurrentUser(userData); // Explicitly set the user data
```

## Step 6: Testing Checklist

1. **Form Submission Test:**
   - Fill out registration form with name
   - Check browser console for form data logs
   - Verify name is captured correctly

2. **Firebase Auth Test:**
   - Check Firebase Console > Authentication > Users
   - Verify user is created with correct email
   - Check if displayName is set

3. **Firestore Test:**
   - Check Firebase Console > Firestore > users collection
   - Verify document exists with user's UID
   - Confirm name field has correct value

4. **Frontend Display Test:**
   - After registration, check if name appears in header
   - Use React DevTools to inspect currentUser state
   - Verify user object has name property

## Step 7: Additional Debugging Tools

### Browser DevTools
1. **Network Tab:** Check for failed Firebase requests
2. **Console Tab:** Look for error messages and debug logs
3. **Application Tab:** Check Local Storage for Firebase auth tokens

### React DevTools
1. Install React Developer Tools extension
2. Inspect AuthContext provider state
3. Check currentUser object in Components tab

### Firebase Console
1. **Authentication:** Verify user creation
2. **Firestore:** Check document structure
3. **Usage:** Monitor API calls and errors

## Conclusion

Follow these steps systematically to identify where the user name is being lost in the registration process. The most common issues are:

1. Form state not properly connected
2. Name parameter not passed to registration function
3. Firestore security rules blocking writes
4. User state not updating after successful registration

Start with Step 1 and work through each step, adding the suggested logging to identify exactly where the process is failing.