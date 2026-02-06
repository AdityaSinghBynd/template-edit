import { forwardRef, useEffect, useRef, useImperativeHandle, useState } from 'react';

interface PreviewPaneProps {
  html: string;
  highlightedPath?: string | null;
  onElementClick?: (editId: string, rect: DOMRect, currentValue: string) => void;
  onSelectionChanged?: (selectedIds: string[]) => void;
  onElementDuplicate?: (elementId: string) => void;
  onElementDelete?: (elementId: string) => void;
}

// Script for both highlighting (left → right) and click detection (right → parent)
const HIGHLIGHT_SCRIPT = `
<script>
(function() {
  // ===========================================
  // UNIFIED PREVIEW SCRIPT
  // Single click handler, no duplicates
  // ===========================================
  
  let highlightBox = null;
  let hoverBox = null;
  let selectedElements = []; // Array of element IDs (data-edit-id or xpath:...)
  
  // --- Helper: Check if we're in unlock mode ---
  function isUnlockMode() {
    return document.body.hasAttribute('data-unlock-mode');
  }
  
  // --- Helper: Get XPath for element without ID ---
  // Returns full path from /html[1]/body[1]/... for DOMParser compatibility
  function getXPath(element) {
    if (!element) return '';
    if (element === document.documentElement) return '/html[1]';
    if (element === document.body) return '/html[1]/body[1]';
    if (element.id) return '//*[@id="' + element.id + '"]';
    
    var ix = 0;
    var siblings = element.parentNode ? element.parentNode.children : [];
    for (var i = 0; i < siblings.length; i++) {
      var sibling = siblings[i];
      if (sibling === element) {
        var parentPath = getXPath(element.parentNode);
        return parentPath + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
      }
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        ix++;
      }
    }
    return '';
  }
  
  // --- Helper: Get element's ID ---
  function getElementId(el) {
    return el.getAttribute('data-edit-id') || 'xpath:' + getXPath(el);
  }
  
  // --- Helper: Meaningful tags for unlock mode ---
  var MEANINGFUL_TAGS = ['IMG', 'TABLE', 'TR', 'TD', 'TH', 'DIV', 'SPAN', 'P', 'A', 
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 
    'FIGURE', 'FIGCAPTION', 'B', 'STRONG', 'I', 'EM', 'U', 'HR'];
  
  // --- Find the best target element ---
  function findTarget(rawTarget) {
    if (isUnlockMode()) {
      // In unlock mode: find closest meaningful element
      var el = rawTarget;
      while (el && el !== document.body) {
        if (MEANINGFUL_TAGS.indexOf(el.tagName) !== -1) {
          var rect = el.getBoundingClientRect();
          // Skip very large layout divs
          if (rect.width < window.innerWidth * 0.9 || el.tagName !== 'DIV') {
            return el;
          }
        }
        el = el.parentElement;
      }
      // Fallback to data-edit-id if no meaningful element found
      return rawTarget.closest('[data-edit-id]');
    } else {
      // Normal mode: only data-edit-id elements
      return rawTarget.closest('[data-edit-id]');
    }
  }
  
  // ===========================================
  // HIGHLIGHT BOX (for left panel hover)
  // ===========================================
  function createHighlightBox() {
    if (highlightBox) return highlightBox;
    highlightBox = document.createElement('div');
    highlightBox.id = 'element-highlight';
    highlightBox.style.cssText = 'position:absolute;border:2px solid #338488;background:rgba(51,132,136,0.1);pointer-events:none;z-index:99998;transition:all 0.15s ease-out;border-radius:4px;display:none;';
    document.body.appendChild(highlightBox);
    return highlightBox;
  }
  
  function highlightElement(path) {
    if (!path) {
      if (highlightBox) highlightBox.style.display = 'none';
      return;
    }
    try {
      var selectors = path.split(' > ');
      var current = document.body;
      for (var i = 0; i < selectors.length; i++) {
        if (!current) break;
        var selector = selectors[i];
        var nthMatch = selector.match(/(.+):nth-child\\((\\d+)\\)/);
        if (nthMatch) {
          var tag = nthMatch[1];
          var idx = parseInt(nthMatch[2]) - 1;
          var children = current.children;
          if (idx >= 0 && idx < children.length && children[idx].tagName.toLowerCase() === tag.toLowerCase()) {
            current = children[idx];
          } else {
            current = null;
          }
        } else {
          current = current.querySelector(selector);
        }
      }
      if (current) {
        var box = createHighlightBox();
        var rect = current.getBoundingClientRect();
        box.style.display = 'block';
        box.style.top = (rect.top + window.scrollY - 4) + 'px';
        box.style.left = (rect.left + window.scrollX - 4) + 'px';
        box.style.width = (rect.width + 8) + 'px';
        box.style.height = (rect.height + 8) + 'px';
        current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (e) {}
  }
  
  // ===========================================
  // HOVER BOX (blue dashed for clickable items)
  // ===========================================
  function createHoverBox() {
    if (hoverBox) return hoverBox;
    hoverBox = document.createElement('div');
    hoverBox.id = 'editable-hover';
    hoverBox.style.cssText = 'position:absolute;border:2px dashed #0066cc;background:rgba(0,102,204,0.05);pointer-events:none;z-index:99997;transition:all 0.1s ease-out;border-radius:4px;display:none;';
    
    // Toolbar container (Inside top-right)
    var toolbar = document.createElement('div');
    toolbar.style.cssText = 'position:absolute;top:4px;right:4px;display:flex;gap:4px;pointer-events:auto;z-index:99999;';

    // Click to edit tooltip (Top Center)
    var tooltip = document.createElement('div');
    tooltip.style.cssText = 'position:absolute;top:-24px;left:50%;transform:translateX(-50%);background:#0066cc;color:white;font-size:10px;font-weight:600;padding:2px 8px;border-radius:3px;white-space:nowrap;font-family:-apple-system,sans-serif;';
    tooltip.textContent = 'Click to edit';
    hoverBox.appendChild(tooltip);
    
    // Style helper
    function styleBtn(btn) {
      btn.style.cssText = 'background:white;border:1px solid #0066cc;color:#0066cc;border-radius:4px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,0.1);transition:all 0.1s ease;';
      btn.addEventListener('mouseover', function() { this.style.background = '#0066cc'; this.style.color = 'white'; });
      btn.addEventListener('mouseout', function() { this.style.background = 'white'; this.style.color = '#0066cc'; });
      return btn;
    }

    // Duplicate Button
    var dupBtn = document.createElement('div');
    dupBtn.title = 'Duplicate Element';
    dupBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
    styleBtn(dupBtn);
    
    dupBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (lastHoveredEl) {
        var editId = getElementId(lastHoveredEl);
        window.parent.postMessage({ type: 'DUPLICATE_ELEMENT', editId: editId }, '*');
      }
    });

    // Delete Button
    var delBtn = document.createElement('div');
    delBtn.title = 'Delete Element';
    delBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
    styleBtn(delBtn);
    delBtn.style.borderColor = '#ef4444'; 
    delBtn.style.color = '#ef4444';
    
    delBtn.addEventListener('mouseover', function() { this.style.background = '#ef4444'; this.style.color = 'white'; });
    delBtn.addEventListener('mouseout', function() { this.style.background = 'white'; this.style.color = '#ef4444'; });

    delBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (lastHoveredEl) {
          // if (confirm('Delete this element?')) {
            var editId = getElementId(lastHoveredEl);
            window.parent.postMessage({ type: 'DELETE_ELEMENT', editId: editId }, '*');
          // }
      }
    });

    toolbar.appendChild(dupBtn);
    toolbar.appendChild(delBtn);
    hoverBox.appendChild(toolbar);
    document.body.appendChild(hoverBox);
    return hoverBox;
  }
  
  var lastHoveredEl = null;
  document.addEventListener('mouseover', function(e) {
    if (selectedElements.length > 1) return;
    var target = findTarget(e.target);
    if (target && target !== lastHoveredEl) {
      lastHoveredEl = target;
      var box = createHoverBox();
      var rect = target.getBoundingClientRect();
      box.style.display = 'block';
      box.style.top = (rect.top + window.scrollY - 4) + 'px';
      box.style.left = (rect.left + window.scrollX - 4) + 'px';
      box.style.width = (rect.width + 8) + 'px';
      box.style.height = (rect.height + 8) + 'px';
    }
  });
  
  document.addEventListener('mouseout', function(e) {
    if (hoverBox && lastHoveredEl) {
      var related = e.relatedTarget;
      // Fixed: Don't hide if moving to the toolbar/buttons (which are inside hoverBox)
      var insideBox = related && (hoverBox === related || hoverBox.contains(related));
      var insideTarget = related && lastHoveredEl.contains(related);
      
      if (!insideTarget && !insideBox) {
        hoverBox.style.display = 'none';
        lastHoveredEl = null;
      }
    }
  });
  
  // ===========================================
  // SELECTION HIGHLIGHTS
  // ===========================================
  function updateSelectionHighlights() {
    document.querySelectorAll('.shift-selected').forEach(function(el) {
      el.classList.remove('shift-selected');
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
    selectedElements.forEach(function(id) {
      var el;
      if (id.startsWith('xpath:')) {
        try {
          var xpath = id.substring(6);
          var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          el = result.singleNodeValue;
        } catch(e) {}
      } else {
        el = document.querySelector('[data-edit-id="' + id + '"]');
      }
      if (el) {
        el.classList.add('shift-selected');
        el.style.outline = '3px solid #e53e3e';
        el.style.outlineOffset = '2px';
      }
    });
  }
  
  function clearSelection() {
    selectedElements = [];
    updateSelectionHighlights();
  }
  
  function notifySelectionChanged() {
    window.parent.postMessage({
      type: 'SELECTION_CHANGED',
      selectedIds: selectedElements.slice(),
      count: selectedElements.length
    }, '*');
  }
  
  // ===========================================
  // SINGLE UNIFIED CLICK HANDLER
  // ===========================================
  document.addEventListener('click', function(e) {
    var target = findTarget(e.target);
    var elementId = target ? getElementId(target) : null;
    
    // CASE 1: Clicked outside any element
    if (!target) {
      if (selectedElements.length > 0 && !e.shiftKey) {
        clearSelection();
        notifySelectionChanged();
      }
      return;
    }
    
    // CASE 2: Shift+Click = Toggle selection
    if (e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      
      var idx = selectedElements.indexOf(elementId);
      if (idx === -1) {
        selectedElements.push(elementId);
      } else {
        selectedElements.splice(idx, 1);
      }
      updateSelectionHighlights();
      notifySelectionChanged();
      return;
    }
    
    // CASE 3: Normal click
    // If there are multiple selected, just clear and don't do anything else
    if (selectedElements.length > 1) {
      clearSelection();
      notifySelectionChanged();
      return;
    }
    
    // If clicking on different element, clear selection
    if (selectedElements.length === 1 && selectedElements[0] !== elementId) {
      clearSelection();
      notifySelectionChanged();
    }
    
    // Send click event for editing (only for data-edit-id elements)
    var dataEditId = target.getAttribute('data-edit-id');
    if (dataEditId) {
      e.preventDefault();
      e.stopPropagation();
      
      var rect = target.getBoundingClientRect();
      window.parent.postMessage({
        type: 'EDITABLE_CLICK',
        editId: dataEditId,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        text: target.textContent ? target.textContent.trim() : '',
        scrollY: window.scrollY
      }, '*');
    }
  });
  
  // ===========================================
  // MESSAGE HANDLERS FROM PARENT
  // ===========================================
  window.addEventListener('message', function(e) {
    if (!e.data) return;
    if (e.data.type === 'CLEAR_SELECTION') {
      clearSelection();
    }
    if (e.data.type === 'HIGHLIGHT_ELEMENT') {
      highlightElement(e.data.elementPath);
    }
  });
})();
</script>
`;

export const PreviewPane = forwardRef<HTMLIFrameElement, PreviewPaneProps>(
  function PreviewPane({ html, highlightedPath, onElementClick, onSelectionChanged, onElementDuplicate, onElementDelete }, ref) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const lastScrollY = useRef(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const prevHtmlRef = useRef(html);

    useImperativeHandle(ref, () => iframeRef.current as HTMLIFrameElement);

    // Inject highlight script into HTML
    const enhancedHTML = html.replace('</body>', HIGHLIGHT_SCRIPT + '</body>');

    // Listen for click messages from iframe
    useEffect(() => {
      const handleMessage = (e: MessageEvent) => {
        // Handle single element click
        if (e.data?.type === 'EDITABLE_CLICK' && onElementClick) {
          const iframe = iframeRef.current;
          if (iframe) {
            const iframeRect = iframe.getBoundingClientRect();
            const adjustedRect = new DOMRect(
              e.data.rect.left + iframeRect.left,
              e.data.rect.top + iframeRect.top,
              e.data.rect.width,
              e.data.rect.height
            );
            onElementClick(e.data.editId, adjustedRect, e.data.text);
          }
        }

        // Handle selection changed (Shift+Click toggle)
        if (e.data?.type === 'SELECTION_CHANGED' && onSelectionChanged) {
          onSelectionChanged(e.data.selectedIds);
        }

        // Handle duplicate
        if (e.data?.type === 'DUPLICATE_ELEMENT' && onElementDuplicate) {
          onElementDuplicate(e.data.editId);
        }

        // Handle delete
        if (e.data?.type === 'DELETE_ELEMENT' && onElementDelete) {
          onElementDelete(e.data.editId);
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }, [onElementClick, onSelectionChanged, onElementDuplicate, onElementDelete]);

    // Detect HTML changes and show skeleton
    useEffect(() => {
      if (html !== prevHtmlRef.current) {
        setIsLoading(true);
        setShowSkeleton(true);
        prevHtmlRef.current = html;

        const iframe = iframeRef.current;
        if (iframe?.contentWindow) {
          try {
            lastScrollY.current = iframe.contentWindow.scrollY || 0;
          } catch {
            // Cross-origin restrictions
          }
        }
      }
    }, [html]);

    // Restore scroll position after load
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setShowSkeleton(false), 300);
      }, 150);

      const iframe = iframeRef.current;
      if (iframe?.contentWindow && lastScrollY.current > 0) {
        setTimeout(() => {
          try {
            iframe.contentWindow?.scrollTo(0, lastScrollY.current);
          } catch {
            // Cross-origin restrictions
          }
        }, 50);
      }
    };

    // Send highlight message when path changes
    useEffect(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'HIGHLIGHT_ELEMENT',
          elementPath: highlightedPath
        }, '*');
      }
    }, [highlightedPath]);

    return (
      <div className="editor-preview">

        <div className="preview-container">
          {showSkeleton && (
            <div className={`preview-skeleton ${isLoading ? 'visible' : 'fading'}`}>
              <div className="skeleton-header" />
              <div className="skeleton-banner" />
              <div className="skeleton-line wide" />
              <div className="skeleton-line" />
              <div className="skeleton-line narrow" />
              <div className="skeleton-spacer" />
              <div className="skeleton-line wide" />
              <div className="skeleton-line" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            className={`preview-frame ${isLoading ? 'loading' : 'loaded'}`}
            srcDoc={enhancedHTML}
            title="Email Preview"
            sandbox="allow-same-origin allow-scripts"
            onLoad={handleLoad}
          />
        </div>
      </div>
    );
  }
);
