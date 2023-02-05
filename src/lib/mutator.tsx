import { createContext, useCallback, useContext, useState } from "react"
import { mutate } from "swr"

type SomeKey = Record<string, unknown>
type MutatorStore = Record<string, Set<string>>
type RegisterMutator = (key: SomeKey, ids: string[]) => void
type Mutate = (key: SomeKey) => Promise<void>

const convertKey = (key: SomeKey): string => JSON.stringify(key)

const useMutatorStore = (): { register: RegisterMutator; mut: Mutate } => {
  const [store, setStore] = useState<MutatorStore>({})

  const register = useCallback<RegisterMutator>((key, ids) => {
    setStore((prev) => ({ ...prev, [convertKey(key)]: new Set(ids) }))
  }, [])

  const mut = useCallback<Mutate>(
    async (key) => {
      // 1. keyからidを引く
      const ids = store[convertKey(key)] ?? new Set()

      // 2. idからそれを指すkeyを逆引き
      const targets = Object.entries(store).filter(([_, value]) =>
        [...ids].some((id) => value.has(id))
      )

      // 3. keyをまとめてmutate
      await Promise.all(targets.map(([key]) => mutate(JSON.parse(key))))
    },
    [store]
  )

  return {
    register,
    mut,
  }
}

type MutatorContextValue = ReturnType<typeof useMutatorStore>

const MutatorContext = createContext<MutatorContextValue>(
  {} as MutatorContextValue
)

export const MutatorContextProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  return (
    <MutatorContext.Provider value={useMutatorStore()}>
      {children}
    </MutatorContext.Provider>
  )
}

export const useMutatorContext = () => useContext(MutatorContext)
