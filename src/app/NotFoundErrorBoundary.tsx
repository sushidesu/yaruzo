import React, { Fragment } from "react"
import { isLocationNotFoundError } from "rocon/react"

type State = {
  notFound: boolean
}

export class NotFoundErrorBoundary extends React.Component<{
  children: React.ReactNode
}> {
  override state: State = {
    notFound: false,
  }

  override componentDidCatch(error: unknown) {
    if (isLocationNotFoundError(error)) {
      this.setState({
        notFound: true,
      })
    } else {
      throw error
    }
  }

  override render() {
    if (this.state.notFound) {
      return <div>404 Not Found</div>
    } else {
      return <Fragment>{this.props.children}</Fragment>
    }
  }
}
