import { useReducer, Reducer, Dispatch, useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

export const App = () => {
  return <Server />
}

type State = Yarukoto[]

type Action =
  | {
      type: "add"
      name: string
    }
  | {
      type: "complete"
      id: string
    }
  | {
      type: "remove"
      id: string
    }

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "add":
      return [
        ...state,
        {
          id: uuidv4(),
          name: action.name,
          completedAt: undefined,
        },
      ]
    case "complete":
      return state.map((y) => {
        if (y.id === action.id) {
          return {
            ...y,
            completedAt: Date.now(),
          }
        } else {
          return y
        }
      })
    case "remove":
      return state.filter((y) => y.id !== action.id)
  }
}

const Server = (): JSX.Element => {
  const [yarukotos, dispatch] = useReducer(reducer, [])
  return <Client yarukotos={yarukotos} dispatch={dispatch} />
}

/* ------------------ */

type Yarukoto = {
  id: string
  name: string
  completedAt: number | undefined
}

/* ------------------ */

type ClientProps = {
  yarukotos: Yarukoto[]
  dispatch: Dispatch<Action>
}

const Client = (props: ClientProps): JSX.Element => {
  const { yarukotos, dispatch } = props

  const [text, setText] = useState("")

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setText(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault()
      dispatch({
        type: "add",
        name: text,
      })
      setText("")
    },
    [text]
  )

  const handleRemove = useCallback(
    (id: string) => () => {
      dispatch({
        type: "remove",
        id,
      })
    },
    []
  )

  const handleComplete = useCallback(
    (id: string) => () => {
      dispatch({
        type: "complete",
        id,
      })
    },
    []
  )

  return (
    <div>
      <h1>Yaruzo</h1>
      <form onSubmit={handleSubmit}>
        <input value={text} onChange={handleChange} />
        <button type={"submit"}>ADD</button>
      </form>
      <ul>
        {yarukotos.map((yarukoto) => (
          <Item
            key={yarukoto.id}
            name={yarukoto.name}
            completedAt={yarukoto.completedAt}
            onClickRemove={handleRemove(yarukoto.id)}
            onClickComplete={handleComplete(yarukoto.id)}
          />
        ))}
      </ul>
    </div>
  )
}

type ItemProps = {
  name: string
  completedAt: number | undefined
  onClickRemove: () => void
  onClickComplete: () => void
}
const Item = (props: ItemProps): JSX.Element => {
  const { name, completedAt, onClickRemove, onClickComplete } = props
  const done = completedAt !== undefined && completedAt <= Date.now()
  return (
    <li>
      <p
        style={{
          textDecoration: done ? "line-through" : undefined,
        }}
      >
        {name}
      </p>
      {!done && <button onClick={onClickComplete}>DONE</button>}
      <button onClick={onClickRemove}>REMOVE</button>
    </li>
  )
}
