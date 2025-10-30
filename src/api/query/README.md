# TanStack Query (React Query) Setup

Complete setup for data fetching with TanStack Query in WaterAbove.

## 🎯 What is TanStack Query?

TanStack Query (formerly React Query) is the **best practice** for:
- ✅ Server state management
- ✅ Caching and synchronization
- ✅ Background refetching
- ✅ Automatic retry on failure
- ✅ Loading and error states
- ✅ Optimistic updates

## 📂 Structure

```
src/api/query/
├── queryClient.ts           # Query client configuration
├── mutations/
│   └── useAuthMutations.ts  # Auth mutations (login, register, etc.)
├── queries/
│   └── useUserQueries.ts    # User queries (get user, profile, etc.)
├── README.md
└── index.ts
```

## 🚀 Quick Start

### 1. Already Setup ✅

The app is already configured with TanStack Query:

```typescript
// App.tsx
<QueryClientProvider client={queryClient}>
  <SafeAreaProvider>
    <RootNavigator />
  </SafeAreaProvider>
</QueryClientProvider>
```

### 2. Using Mutations (POST, PUT, DELETE)

#### Login Example

```typescript
import {useLoginMutation} from '@/api/query';

const LoginScreen = () => {
  const loginMutation = useLoginMutation();

  const handleLogin = () => {
    loginMutation.mutate(
      { email: 'user@example.com', password: 'password' },
      {
        onSuccess: (data) => {
          console.log('✅ Logged in:', data.user);
          // Navigate to home
        },
        onError: (error) => {
          console.error('❌ Login failed:', error);
          alert('Login failed');
        },
      }
    );
  };

  return (
    <Button
      title="Login"
      onPress={handleLogin}
      loading={loginMutation.isPending}
      disabled={loginMutation.isPending}
    />
  );
};
```

#### Register Example

```typescript
import {useRegisterMutation} from '@/api/query';

const registerMutation = useRegisterMutation();

registerMutation.mutate(
  {
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
  },
  {
    onSuccess: () => console.log('Registered!'),
  }
);
```

#### Email Verification Example

```typescript
import {useVerifyEmailMutation} from '@/api/query';

const VerificationScreen = () => {
  const verifyMutation = useVerifyEmailMutation();

  const handleVerify = (email: string) => {
    verifyMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          alert(data.message);
        },
        onError: (error: any) => {
          alert(error.response?.data?.message || 'Verification failed');
        },
      }
    );
  };

  return (
    <Button
      title="Verify Email"
      onPress={() => handleVerify('user@example.com')}
      loading={verifyMutation.isPending}
    />
  );
};
```

### 3. Using Queries (GET)

#### Get Current User

```typescript
import {useUserQuery} from '@/api/query';

const ProfileScreen = () => {
  const { data: user, isLoading, error, refetch } = useUserQuery();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <View>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Button title="Refresh" onPress={() => refetch()} />
    </View>
  );
};
```

#### Conditional Fetch

```typescript
const { data, isLoading } = useUserByIdQuery(userId, {
  enabled: !!userId, // Only fetch if userId exists
});
```

## 🎨 Mutation States

All mutations provide these states:

```typescript
const mutation = useLoginMutation();

mutation.isPending    // true while request is in progress
mutation.isSuccess    // true when request succeeds
mutation.isError      // true when request fails
mutation.error        // Error object if failed
mutation.data         // Response data if successful
```

### Example with All States

```typescript
const LoginScreen = () => {
  const loginMutation = useLoginMutation();

  return (
    <View>
      <Button
        title="Login"
        onPress={() => loginMutation.mutate({ email, password })}
        loading={loginMutation.isPending}
        disabled={loginMutation.isPending}
      />

      {loginMutation.isPending && <Text>Logging in...</Text>}
      
      {loginMutation.isError && (
        <Text style={styles.error}>
          Error: {loginMutation.error?.message}
        </Text>
      )}
      
      {loginMutation.isSuccess && (
        <Text style={styles.success}>
          Welcome, {loginMutation.data?.user.name}!
        </Text>
      )}
    </View>
  );
};
```

## 🎨 Query States

All queries provide these states:

```typescript
const query = useUserQuery();

query.isLoading       // true on first fetch
query.isFetching      // true on any fetch (including background)
query.isSuccess       // true when data is available
query.isError         // true when query fails
query.error           // Error object
query.data            // Response data
query.refetch()       // Manual refetch
```

### Example with Loading States

```typescript
const ProfileScreen = () => {
  const { data, isLoading, isFetching, error } = useUserQuery();

  return (
    <View>
      {isLoading && <LoadingSpinner />}
      
      {isFetching && !isLoading && <Text>Refreshing...</Text>}
      
      {error && <Text>Error: {error.message}</Text>}
      
      {data && (
        <View>
          <Text>{data.name}</Text>
          <Text>{data.email}</Text>
        </View>
      )}
    </View>
  );
};
```

## 🔄 Caching & Refetching

### Automatic Caching

Data is automatically cached by query key:

```typescript
// First call - fetches from server
const { data } = useUserQuery();

// Second call (anywhere else) - uses cached data
const { data } = useUserQuery();
```

### Manual Invalidation

```typescript
import {useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '@/api/query';

const Component = () => {
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    // Update user on server
    await updateUser();
    
    // Invalidate cache to trigger refetch
    queryClient.invalidateQueries({
      queryKey: queryKeys.user.me,
    });
  };
};
```

### Manual Refetch

```typescript
const { refetch } = useUserQuery();

<Button title="Refresh" onPress={() => refetch()} />
```

## 🎯 Best Practices

### 1. Use Mutations for Write Operations

```typescript
// ✅ Good - Use mutation
const loginMutation = useLoginMutation();
loginMutation.mutate({ email, password });

// ❌ Bad - Direct API call
await authService.login({ email, password });
```

### 2. Use Queries for Read Operations

```typescript
// ✅ Good - Use query (automatic caching)
const { data } = useUserQuery();

// ❌ Bad - Direct API call (no caching)
const data = await userService.getCurrentUser();
```

### 3. Handle Loading and Error States

```typescript
// ✅ Good
const { data, isLoading, error } = useUserQuery();
if (isLoading) return <Loading />;
if (error) return <Error />;
return <Profile user={data} />;

// ❌ Bad - No loading/error handling
const { data } = useUserQuery();
return <Profile user={data} />; // data might be undefined!
```

### 4. Use Query Keys Consistently

```typescript
// ✅ Good - Use centralized query keys
import {queryKeys} from '@/api/query';
queryClient.invalidateQueries({ queryKey: queryKeys.user.me });

// ❌ Bad - Magic strings
queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
```

## 📝 Creating New Mutations

### Step 1: Add to Service

```typescript
// src/api/services/post.service.ts
export const postService = {
  createPost: async (data: CreatePostRequest) => {
    const response = await apiClient.post('/posts', data);
    return response.data;
  },
};
```

### Step 2: Create Mutation Hook

```typescript
// src/api/query/mutations/usePostMutations.ts
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {postService} from '@/api/services/post.service';
import {queryKeys} from '../queryClient';

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postService.createPost(data),
    onSuccess: () => {
      // Invalidate posts list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
};
```

### Step 3: Use in Component

```typescript
import {useCreatePostMutation} from '@/api/query';

const CreatePostScreen = () => {
  const createPostMutation = useCreatePostMutation();

  const handleCreate = (data: CreatePostRequest) => {
    createPostMutation.mutate(data, {
      onSuccess: () => {
        console.log('Post created!');
        // Navigate back
      },
    });
  };

  return (
    <Button
      title="Create Post"
      onPress={() => handleCreate({ title: 'Hello', content: 'World' })}
      loading={createPostMutation.isPending}
    />
  );
};
```

## 📝 Creating New Queries

### Step 1: Add Query Key

```typescript
// src/api/query/queryClient.ts
export const queryKeys = {
  // ... existing keys
  
  posts: {
    all: ['posts'] as const,
    list: (filters?: any) => ['posts', 'list', filters] as const,
    detail: (id: string) => ['posts', 'detail', id] as const,
  },
};
```

### Step 2: Create Query Hook

```typescript
// src/api/query/queries/usePostQueries.ts
import {useQuery} from '@tanstack/react-query';
import {postService} from '@/api/services/post.service';
import {queryKeys} from '../queryClient';

export const usePostsQuery = (filters?: PostFilters) => {
  return useQuery({
    queryKey: queryKeys.posts.list(filters),
    queryFn: () => postService.getPosts(filters),
  });
};

export const usePostQuery = (postId: string) => {
  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: () => postService.getPost(postId),
    enabled: !!postId,
  });
};
```

### Step 3: Use in Component

```typescript
import {usePostsQuery} from '@/api/query';

const PostsListScreen = () => {
  const { data: posts, isLoading } = usePostsQuery();

  if (isLoading) return <Loading />;

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
};
```

## 🔧 Configuration

The query client is configured in `queryClient.ts`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,         // 10 minutes
      retry: 2,                        // Retry 2 times
      refetchOnWindowFocus: false,     // Don't refetch on focus
      refetchOnReconnect: true,        // Refetch on reconnect
    },
    mutations: {
      retry: 1,                        // Retry once
    },
  },
});
```

## 🐛 Debugging

### React Query Devtools (Optional)

```bash
yarn add @tanstack/react-query-devtools
```

```typescript
// App.tsx (development only)
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {__DEV__ && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

## 📚 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [API Layer](/src/api/README.md)
- [Main README](/README.md)

---

Data fetching made easy! 🚀

