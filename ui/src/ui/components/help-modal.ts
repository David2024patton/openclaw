import { html, nothing, type TemplateResult } from "lit";

export type HelpModalProps = {
  isOpen: boolean;
  title: string;
  content: string | TemplateResult;
  onClose: () => void;
};

/**
 * Renders a modern help modal dialog with backdrop.
 * Replaces the outdated alert() popups with a clean, themed UI.
 */
export function renderHelpModal(props: HelpModalProps) {
  if (!props.isOpen) return nothing;

  return html`
    <!-- Backdrop -->
    <div
      class="help-modal-backdrop"
      @click=${props.onClose}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Escape") props.onClose();
      }}
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.2s ease;
        padding: 1rem;
      "
    >
      <!-- Modal Container -->
      <div
        class="help-modal-container"
        @click=${(e: Event) => {
          e.stopPropagation(); // Prevent closing when clicking inside modal
        }}
        style="
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          max-width: 480px;
          width: 100%;
          max-height: 70vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: modalSlideIn 0.25s ease;
        "
      >
        <!-- Header -->
        <div
          style="
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
          "
        >
          <h3
            style="
              margin: 0;
              font-size: 1.125rem;
              font-weight: 600;
              color: var(--text-strong);
              display: flex;
              align-items: center;
              gap: 0.5rem;
            "
          >
            ℹ️ ${props.title}
          </h3>
          <button
            class="btn btn-sm"
            @click=${props.onClose}
            style="
              background: transparent;
              border: 1px solid var(--border);
              color: var(--muted);
              width: 28px;
              height: 28px;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              border-radius: var(--radius-md);
              transition: all 0.2s ease;
            "
            title="Close (ESC)"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div
          id="help-modal-content"
          style="
            padding: 1.25rem;
            overflow-y: auto;
            flex: 1;
            color: var(--text);
            line-height: 1.6;
            font-size: 0.875rem;
          "
        >
          ${typeof props.content === "string"
            ? html`<div style="white-space: pre-wrap;">${props.content}</div>`
            : props.content}
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .help-modal-container h4 {
        margin: 1.5rem 0 0.75rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-strong);
      }

      .help-modal-container h4:first-child {
        margin-top: 0;
      }

      .help-modal-container p {
        margin: 0.75rem 0;
        color: var(--text);
      }

      .help-modal-container ul,
      .help-modal-container ol {
        margin: 0.75rem 0;
        padding-left: 1.5rem;
      }

      .help-modal-container li {
        margin: 0.5rem 0;
        color: var(--text);
      }

      .help-modal-container code {
        background: rgba(168, 85, 247, 0.15);
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
        font-size: 0.875rem;
        color: var(--accent);
      }

      .help-modal-container pre {
        background: rgba(0, 0, 0, 0.3);
        padding: 1rem;
        border-radius: var(--radius-md);
        overflow-x: auto;
        margin: 1rem 0;
      }

      .help-modal-container pre code {
        background: none;
        padding: 0;
        color: var(--text);
      }

      .help-modal-container strong {
        color: var(--text-strong);
        font-weight: 600;
      }

      .help-modal-backdrop:focus {
        outline: none;
      }
    </style>
  `;
}
