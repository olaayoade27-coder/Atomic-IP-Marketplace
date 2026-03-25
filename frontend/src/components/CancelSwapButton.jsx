import React, { useState } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { cancelSwap } from "../lib/contractClient";
import "./CancelSwapButton.css";

/**
 * CancelSwapButton
 *
 * Props:
 *   swap            - { id, expires_at, status }
 *   ledgerTimestamp - current ledger timestamp (u64, unix seconds)
 *   wallet          - connected wallet object with { address, signTransaction }
 *   onSuccess       - callback fired after successful cancellation
 */
export function CancelSwapButton({ swap, ledgerTimestamp, wallet, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { remaining, formatted } = useCountdown(swap.expires_at);

  // Only show for pending swaps
  if (swap.status !== "Pending") return null;

  const isExpired =
    ledgerTimestamp >= swap.expires_at || remaining === 0;

  const handleCancel = async () => {
    setError(null);
    setLoading(true);
    try {
      await cancelSwap(swap.id, wallet);
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to cancel swap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancel-swap-wrapper">
      {isExpired ? (
        <button
          className="cancel-swap-btn"
          onClick={handleCancel}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <span className="cancel-swap-spinner" aria-label="Cancelling..." />
          ) : (
            "Cancel Swap"
          )}
        </button>
      ) : (
        <div className="cancel-swap-countdown" aria-label="Time until cancellable">
          <span className="cancel-swap-countdown__label">Cancellable in</span>
          <span className="cancel-swap-countdown__timer">{formatted}</span>
        </div>
      )}

      {error && (
        <p className="cancel-swap-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
