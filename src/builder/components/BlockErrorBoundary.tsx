"use client";

import React from "react";

type Props = {
  blockId?: string;
  blockType?: string;
  onRemove?: () => void;
  children: React.ReactNode;
};

type State = { hasError: boolean };

export default class BlockErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[BlockErrorBoundary]", this.props.blockType, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-4 my-3 rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-red-700">
            این بخش قابل نمایش نیست.
          </p>
          {this.props.blockType && (
            <p className="text-xs text-red-600/80 mt-1 font-mono">
              {this.props.blockType}
            </p>
          )}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              className="h-8 px-3 rounded-lg text-xs font-semibold border border-red-200 bg-white text-red-700"
              onClick={() => this.setState({ hasError: false })}
            >
              تلاش مجدد
            </button>
            {this.props.onRemove && (
              <button
                type="button"
                className="h-8 px-3 rounded-lg text-xs font-semibold bg-red-600 text-white"
                onClick={this.props.onRemove}
              >
                حذف بلوک
              </button>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
